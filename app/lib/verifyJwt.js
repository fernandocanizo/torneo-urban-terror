const rfr = require('rfr');
const jwt = require('jsonwebtoken');
const config = require('config');

const Player = rfr('/app/db/models/player');

const secret = config.get('login.secret');


const sendResponse = (url, res) => res.status(401).redirect('/');

const urlExceptions = [
  '/',
  '/register',
  '/register-player',
  '/login',
  '/logout',
];

const verifyJwt = (req, res, next) => {
  if (urlExceptions.find(url => url === req.originalUrl.replace(/(.+)\/$/, '$1'))) {
    console.debug(`${req.originalUrl} doesn't need authentication`);
    return next();
  }

  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    sendResponse(req.originalUrl, res);
  } else {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        console.error(err);
        sendResponse(req.originalUrl, res);
      } else {
        const { password, ...player } = await Player.getFirstBy({ id: decoded.id })
        try {
          req.playerData = {
            ...player,
          };
          return next();
        } catch (e) {
          logger.error(e);
          return sendResponse(req.originalUrl, res);
        }
      }
    });
  }
};


module.exports = verifyJwt;
