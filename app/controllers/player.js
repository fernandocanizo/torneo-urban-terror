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
    let clanId;
    await knex.transaction(async transaction => {
      clanId = await Clan.findBy({ tag: clanData.tag }, { transaction });
      console.debug('>>> clanId', clanId);
      if (0 === clanId.length) {
        console.debug('>>> if');
        clanId = await Clan.insert(clanData, { transaction });
        playerData.fk_clan_id = clanId[0].id;
        console.debug('>>> clanId if', playerData.fk_clan_id);
        await Player.insert(playerData, { transaction });
      } else {
        console.debug('>>> else');
        // TODO replace insert by create and move this logic into model
        playerData.fk_clan_id = clanId[0];
        await Player.insert(playerData, { transaction });
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
