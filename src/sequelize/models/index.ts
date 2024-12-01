import fs from "fs";
import path from "path";
// ** TYPES **
import { ModelCtor, Sequelize } from "sequelize-typescript";
// ** VARIABLES **
import {
  DATABASE,
  DB_DIALECT,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DB_LOGGING,
} from "../../config/index";
const initSequelize = () => {
  const _basename = path.basename(module.filename);
  console.log("===============================================");
  console.log("🔄 Initializing Sequelize...");
  console.log(`🗄️  Database: ${DATABASE}`);
  console.log(`🌍  Host: ${DB_HOST}`);
  console.log(`📂  Dialect: ${DB_DIALECT}`);
  console.log("===============================================");
  const sequelize = new Sequelize(DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: DB_LOGGING === "true" ? console.log : false,
  });

  sequelize
    .authenticate()
    .then(() => {
      console.log("✅ Sequelize connection established successfully.");
      console.log("🚀 Ready to interact with the database!");
      console.log("===============================================");
    })
    .catch((err) => {
      console.error("❌ Unable to connect to the database:");
      console.error(err.message);
      console.log("===============================================");
      process.exit(1);
    });
  const _models = fs
    .readdirSync(__dirname)
    .filter((file: string) => {
      return (
        file !== _basename &&
        (file.slice(-3) === ".ts" || file.slice(-3) === ".js")
      );
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
