const rfr = require('rfr');

const baseModel = rfr('/app/db/models/baseModel');


const bm = baseModel('team');


module.exports = {
  ...bm,
};
