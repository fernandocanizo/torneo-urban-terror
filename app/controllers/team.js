const rfr = require('rfr');

const Player = rfr('/app/db/models/player');


const creationPage = async (req, res) => {
  //const { playerId } = req.body;
  // TODO only for testing
  playerId = 2;
  try {
    const players = await Player.getAllClanMates(playerId);
    res.render('create-team', {
      title: 'Crear equipo',
      players,
      debug: true,
    });
  } catch (e) {
    console.debug(e);
    res.status(500).send('Error en la aplicación');
  }
};

const create = async (req, res) => {
  console.debug('>>>', req.body);
  res.send('Not implemented');
};


module.exports = {
  creationPage,
  create,
};
