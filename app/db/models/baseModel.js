const rfr = require('rfr');

const knex = rfr('/app/db/knex');
const logger = rfr('/app/lib/logger');
const atie = rfr('/app/lib/addTransactionIfExists');


const findBy = tableName => (filter = {}, options = {}) => {
  logger.silly({ filter, options });
  const { transaction, columns = []} = options;
  const query = knex(tableName)
    .select(columns.length ? columns : '*')
    .where(filter);

  logger.silly(query.toString());
  return atie(query, transaction);
};

const getById = tableName => (id, options = {}) => {
  logger.silly({ id, options });
  return findBy(tableName)({ id }, options).first();
};

const insert = tableName => (entities, options = {}) => {
  logger.silly({ entities, options });
  const { transaction, columns = []} = options;

  const query = knex(tableName)
    .insert(entities)
    .returning(columns.length ? columns : '*');

  logger.silly(query.toString());
  return atie(query, transaction);
};

const update = tableName => ({ filter = {}, to = {}}, options = {}) => {
  logger.silly({ filter, to, options });
  const { transaction, columns = []} = options;

  const query = knex(tableName)
    .update(to)
    .where(filter)
    .returning(columns.length ? columns : '*');

  logger.silly(query.toString());
  return atie(query, transaction);
};

const getAll = tableName => (options = {}) => {
  logger.silly(options);
  const { transaction, columns = []} = options;

  const query = knex(tableName).select(columns.length ? columns : '*');
  logger.silly(query.toString());
  return atie(query, transaction);
};

const getFirstBy = tableName => (parameters, options = {}) => {
  logger.silly({ parameters, options });
  const { transaction, columns = []} = options;

  const query = knex(tableName)
    .select(columns.length ? columns : '*')
    .where(parameters)
    .first();

  options.orderBy && query.orderBy(options.orderBy);

  logger.silly(query.toString());
  return atie(query, transaction);
};

const del = tableName => (entity, options = {}) => {
  logger.silly({ entity, options });
  const { transaction } = options;

  const query = knex(tableName).del().where(entity);
  logger.silly(query.toString());
  return atie(query, transaction);
};


module.exports = tableName => ({
  knex,
  findBy: findBy(tableName),
  getById: getById(tableName),
  insert: insert(tableName),
  update: update(tableName),
  getAll: getAll(tableName),
  getFirstBy: getFirstBy(tableName),
  delete: del(tableName),
});
