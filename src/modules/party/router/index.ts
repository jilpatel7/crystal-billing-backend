import { Router } from "express";
import passport, { validationMiddleware } from "../../../middleware";
import { idSchema, partySchema } from "../validation-schema";
import { createParty, deleteParty, getParty, updateParty } from "../controller";

const partyRouter: Router = Router();

const PARTY = "/party"
partyRouter.post(`${PARTY}/create`, passport.authenticate("jwt", { session: false }), validationMiddleware(partySchema), createParty);
partyRouter.put(`${PARTY}/update`, passport.authenticate("jwt", { session: false }), validationMiddleware(partySchema, { isUpdate: true }), updateParty);
partyRouter.post(`${PARTY}/get`, passport.authenticate("jwt", { session: false }), validationMiddleware(idSchema), getParty);
// partyRouter.get(`${PARTY}/get/all`, passport.authenticate("jwt", { session: false }), isLoggedInCompany);
partyRouter.delete(`${PARTY}/delete`, passport.authenticate("jwt", { session: false }), validationMiddleware(idSchema), deleteParty);

export default partyRouter;