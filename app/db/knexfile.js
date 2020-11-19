const rfr = require('rfr');
const path = require('path');
process.env.NODE_CONFIG_DIR = path.join(rfr.root, 'config');
const dbConf = require('config').get('postgres');

const stdPool = {
  min: 2,
  max: 10,
};

const stdMigrations = {
  tableName: 'knex_migrations',
};

const standardConf = {
  client: 'postgresql',
  connection: dbConf.url,
  pool: stdPool,
  migrations: stdMigrations,
};

module.exports = {
  development: standardConf,
  production: standardConf,
};
