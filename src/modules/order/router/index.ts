import { Router } from "express";
import passport, { validationMiddleware } from "../../../middleware";
import { createOrder, deleteOrder, getAllOrders, updateOrder } from "../controller";
import { orderSchema } from "../validation-schema";
import { idSchema } from "../../party/validation-schema";

const orderRouter: Router = Router();

const ORDER = "/order"
orderRouter.post(`${ORDER}/create`, passport.authenticate("jwt", { session: false }), validationMiddleware(orderSchema), createOrder);
orderRouter.put(`${ORDER}/update`, passport.authenticate("jwt", {session: false}), validationMiddleware(orderSchema, { isUpdate: true }), updateOrder);
orderRouter.delete(`${ORDER}/delete`, passport.authenticate("jwt", {session: false}), validationMiddleware(idSchema), deleteOrder);
orderRouter.get(`${ORDER}/get/all`, passport.authenticate("jwt", { session: false }), getAllOrders);

export default orderRouter;