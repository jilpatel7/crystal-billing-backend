import dotenv from 'dotenv';
import IEnvVariables from './types';

// Load environment variables from the `.env` file
dotenv.config({ path: `.env` });

// Extract and validate environment variables
const getEnvVariable = (key: string, defaultValue?: any): any => {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
};

export const {
  PORT,
  JWT_SECRET,
  DATABASE_URL,
  DB_DIALECT,
  DB_SSL,
  DB_LOGGING,
  FRONT_URL,
}: IEnvVariables = {
  PORT: getEnvVariable('PORT', '8080'),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  DB_DIALECT: getEnvVariable('DB_DIALECT', 'postgres'),
  DB_SSL: getEnvVariable('DB_SSL', 'true'),
  DB_LOGGING: getEnvVariable('DB_LOGGING', false),
  FRONT_URL: getEnvVariable('FRONT_URL', 'http://localhost:5173'),
};
