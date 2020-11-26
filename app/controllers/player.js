const rfr = require('rfr');

const knex = rfr('/app/db/knex');
const Player = rfr('/app/db/models/player.js');
const Clan = rfr('/app/db/models/clan.js');


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
      console.debug('>>> dbClan', dbClan);
      if (!dbClan) {
        console.debug('>>> if');
        const [ clanInserted ] = await Clan.insert(clanData, { transaction });
        playerData.fk_clan_id = clanInserted.id;
        console.debug('>>> clanInserted if', playerData.fk_clan_id);
        await Player.create(playerData, { transaction });
      } else {
        console.debug('>>> else');
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

module.exports = {
  register,
};
