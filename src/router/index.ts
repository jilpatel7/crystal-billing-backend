import { Router } from "express";
import authRouter from "../modules/auth/router";
import partyRouter from "../modules/party/router";

const router: Router = Router();

const API = "/api"

router.use(`${API}`, authRouter);
router.use(`${API}`, partyRouter);

export default router;