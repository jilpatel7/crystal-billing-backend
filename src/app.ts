import express, { Application } from "express";
import cors from "cors";
import db from "./sequelize/models";
import { PORT } from "./config";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("===============================================");
  console.log("✨  Server Status: ".padEnd(15) + "ONLINE");
  console.log(`🚀  Listening on: `.padEnd(15) + `http://localhost:${PORT}`);
  console.log(`📅  Start Time: `.padEnd(15) + new Date().toLocaleString());
  db.connect();
});
