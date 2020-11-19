const postgres = {
  user: 'postgres',
  password: '',
  host: 'localhost',
  port: '5432',
  db: 'tut',
};

postgres.url = `postgres://${postgres.user}:${postgres.password}@${postgres.host}:${postgres.port}/${postgres.db}`;
postgres.devUrl = `${postgres.prodUrl}_dev`;


module.exports = {
  postgres,
};
