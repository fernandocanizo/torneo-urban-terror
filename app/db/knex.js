const config = require('config');


const knex = require('knex')({
  client: 'pg',
  connection: config.get('postgres').url,
  searchPath: 'public',
});


module.exports = knex;
