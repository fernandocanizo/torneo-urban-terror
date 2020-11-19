const addTransactionIfExists = (query, transaction) =>
  transaction ? query.transacting(transaction) : query;


module.exports = addTransactionIfExists;
