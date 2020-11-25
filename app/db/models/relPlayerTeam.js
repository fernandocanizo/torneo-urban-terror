const rfr = require('rfr');

const baseModel = rfr('/app/db/models/baseModel');


const bm = baseModel('rel_player_team');


module.exports = {
  ...bm,
};
