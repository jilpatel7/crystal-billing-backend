const dotenv = require('dotenv');

// dot env config
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const DB_DIALECT = process.env.DB_DIALECT || 'postgres';
const DB_SSL = process.env.DB_SSL || 'true';

const dialectOptions = {
  bigNumberStrings: true,
};

if (DB_SSL === 'true') {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false,
  };
}

const config = {
  url: DATABASE_URL,
  dialect: DB_DIALECT,
  dialectOptions,
};

// sequelize-cli selects the entry by NODE_ENV (defaults to "development"),
// so expose the same env-driven config for every environment.
module.exports = {
  development: config,
  test: config,
  production: config,
};
