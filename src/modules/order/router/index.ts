import { Router } from "express";
import passport, { validationMiddleware } from "../../../middleware";
import { createLot, createOrder, deleteLot, deleteOrder, getAllOrders, getOrder, updateLot, updateOrder } from "../controller";
import { orderDetailsSchema, orderSchema } from "../validation-schema";
import { idSchema } from "../../party/validation-schema";

const orderRouter: Router = Router();

const ORDER = "/order"
orderRouter.post(`${ORDER}/create`, passport.authenticate("jwt", { session: false }), validationMiddleware(orderSchema), createOrder);
orderRouter.put(`${ORDER}/update`, passport.authenticate("jwt", {session: false}), validationMiddleware(orderSchema, { isUpdate: true }), updateOrder);
orderRouter.delete(`${ORDER}/delete`, passport.authenticate("jwt", {session: false}), validationMiddleware(idSchema), deleteOrder);
orderRouter.get(`${ORDER}/get/all`, passport.authenticate("jwt", { session: false }), getAllOrders);
orderRouter.get(`${ORDER}/get`, passport.authenticate("jwt", { session: false }), getOrder);
orderRouter.post(`${ORDER}/lot/create`, passport.authenticate("jwt", { session: false }), validationMiddleware(orderDetailsSchema), createLot);
orderRouter.delete(`${ORDER}/lot/delete`, passport.authenticate("jwt", { session: false }), validationMiddleware(idSchema), deleteLot);
orderRouter.put(`${ORDER}/lot/update`, passport.authenticate("jwt", { session: false }), validationMiddleware(orderDetailsSchema, { isUpdate: true }), updateLot);

export default orderRouter;