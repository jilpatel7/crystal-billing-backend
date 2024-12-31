import { Router } from "express";
import passport, { validationMiddleware } from "../../../middleware";
import { createOrder } from "../controller";
import { orderSchema } from "../validation-schema";

const orderRouter: Router = Router();

const ORDER = "/order"
orderRouter.post(`${ORDER}/create`, passport.authenticate("jwt", { session: false }), validationMiddleware(orderSchema), createOrder);

export default orderRouter;