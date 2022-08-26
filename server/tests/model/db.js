const mongoose = require('mongoose');
const logger = require('log4js').getLogger('TestDb');
const testDb = {};

testDb.connect = () => {
  const db = mongoose.connection;
  db.on('error', () => logger.error('Failed to open connection to test database'));
  return mongoose.connect('mongodb://localhost:27017/testDatabase', { useMongoClient: true });
};

testDb.drop = () => mongoose.connection.db.dropDatabase(() => mongoose.connection.close());
testDb.clear = collection => collection.remove({});

module.exports = testDb;
