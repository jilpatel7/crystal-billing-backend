import { Router } from "express";
import authRouter from "../modules/auth/router";

const router: Router = Router();

const API = "/api"

router.use(`${API}`, authRouter);

export default router;