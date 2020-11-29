const rfr = require('rfr');
const jwt = require('jsonwebtoken');
const config = require('config');

const logger = rfr('/app/lib/logger');
const Player = rfr('/app/db/models/player');


const secret = config.get('login.secret');

const send401 = res => res.status(401).redirect('/');

const urlExceptions = [
  '/',
  '/rules',
  '/register',
  '/register-player',
  '/login',
  '/logout',
];


const verifyJwt = (req, res, next) => {
  const checkUrl = url => url === req.originalUrl.replace(/(.+)\/$/, '$1');

  if (urlExceptions.some(checkUrl)) {
    logger.debug(`"${req.originalUrl}" doesn't need authentication`);
    return next();
  }

  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    send401(res);
    logger.debug('no token');
  } else {
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        logger.error(err);
        send401(res);
      } else {
        const { password, ...player } = await Player.getFirstBy({
          id: decoded.id,
        });

        try {
          logger.debug('got player');
          req.playerData = { ...player };
          return next();
        } catch (e) {
          logger.error(e);
          return send401(res);
        }
      }
    });
  }
};


module.exports = verifyJwt;
