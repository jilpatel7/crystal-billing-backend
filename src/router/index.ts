import { Router } from "express";
import authRouter from "../modules/auth/router";
import partyRouter from "../modules/party/router";
import orderRouter from "../modules/order/router";

const router: Router = Router();

const API = "/api"

router.use(`${API}`, authRouter);
router.use(`${API}`, partyRouter);
router.use(`${API}`, orderRouter);

export default router;