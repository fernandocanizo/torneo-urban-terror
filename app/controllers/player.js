const config = require('config');
const rfr = require('rfr');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const knex = rfr('/app/db/knex');
const Player = rfr('/app/db/models/player');
const Clan = rfr('/app/db/models/clan');

const secret = config.get('login.secret');


const register = async (req, res) => {
  // TODO validate
  const playerData = {
    web_nick: req.body.web_nick,
    auth_nick: req.body.auth_nick,
    discord_nick: req.body.discord_nick,
    email: req.body.email,
    password: req.body.password,
  };

  const clanData = {
    name: req.body.clan_name,
    tag: req.body.clan_tag,
  };

  try {
    await knex.transaction(async transaction => {
      const dbClan = await Clan.getFirstBy({ tag: clanData.tag }, { transaction });
      if (!dbClan) {
        const [ clanInserted ] = await Clan.insert(clanData, { transaction });
        playerData.fk_clan_id = clanInserted.id;
        await Player.create(playerData, { transaction });
      } else {
        playerData.fk_clan_id = dbClan.id;
        await Player.create(playerData, { transaction });
      }
    });

    res.render('player-registration-success', {
      title: 'Torneo Urban Terror Latinoamericano',
    });

  } catch (e) {
    console.debug(e);
    res.status(500).send('Falló el registro de usuario');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Player.getFirstBy({ email });
    if (!user) {
      console.debug(`No se encuentra el mail ${email}`);
      return res.status(401).send('Usuario no registrado');
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      console.debug(`Contraseña incorrecta del usuario ${email}`);
      return res.status(401).send('Contraseña incorrecta');
    }

    console.debug(`Login correcto ${email}`);
    delete user.password;

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true })

    return res.status(200).redirect('/view-authenticated');
  } catch (e) {
    console.debug(e);
    res.status(500).send('Falló el login de usuario');
  }
};

const logout = (req, res) => {
  return res
    .status(200)
    .cookie('token', 'invalid_token', { httpOnly: true })
    .redirect('/');
};


module.exports = {
  register,
  login,
  logout,
};
