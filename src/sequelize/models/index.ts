import fs from 'fs';
import path from 'path';
// ** TYPES **
import { ModelCtor, Sequelize } from 'sequelize-typescript';
// ** VARIABLES **
import { DATABASE_URL, DB_DIALECT, DB_SSL, DB_LOGGING } from '../../config/index';
const initSequelize = () => {
  const _basename = path.basename(module.filename);
  console.log('===============================================');
  console.log('🔄 Initializing Sequelize...');
  console.log(`📂  Dialect: ${DB_DIALECT}`);
  console.log('===============================================');

  const dialectOptions: any = {
    bigNumberStrings: true,
  };

  if (DB_SSL === 'true') {
    dialectOptions.ssl = {
      require: true,
      rejectUnauthorized: false,
    };
  }

  const sequelize = new Sequelize(DATABASE_URL, {
    dialect: DB_DIALECT as any,
    logging: DB_LOGGING === 'true' ? console.log : false,
    dialectOptions,
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log('✅ Sequelize connection established successfully.');
      console.log('🚀 Ready to interact with the database!');
      console.log('===============================================');
    })
    .catch((err) => {
      console.error('❌ Unable to connect to the database:');
      console.error(err.message);
      console.log('===============================================');
      process.exit(1);
    });
  const _models = fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return file !== _basename && (file.slice(-3) === '.ts' || file.slice(-3) === '.js');
    })
    .map((file: string) => {
      const model: ModelCtor = require(path.join(__dirname, file))?.default;
      return model;
    });
  sequelize.addModels(_models);
  return sequelize;
};
const db = {
  connect: initSequelize,
};
export default db;
