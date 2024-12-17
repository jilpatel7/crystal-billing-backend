import express, { Application } from "express";
import cors from "cors";
import db from "./sequelize/models";
import { FRONT_URL, PORT } from "./config";
import router from "./router";
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(cors({
  origin: FRONT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.listen(PORT, () => {
  console.log("===============================================");
  console.log("✨  Server Status: ".padEnd(15) + "ONLINE");
  console.log(`🚀  Listening on: `.padEnd(15) + `http://localhost:${PORT}`);
  console.log(`📅  Start Time: `.padEnd(15) + new Date().toLocaleString());
  db.connect();
});
