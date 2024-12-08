const path = require('path');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'db', 'dev.db'), // SQLite file for development
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:', // In-memory database for testing
  },
  production: {
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'db', 'dev.db'), // SQLite file for production
    logging: false, // Disable logging in production
  },
};

