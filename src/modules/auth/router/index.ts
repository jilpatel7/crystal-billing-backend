import { Router } from "express";
import { isLoggedInCompany, loginCompany } from "../controller";
import passport, { validationMiddleware } from "../../../middleware";
import { companyLogin } from "../validation-schema";

const authRouter: Router = Router();

const AUTH = "/auth"
authRouter.post(`${AUTH}/login`, validationMiddleware(companyLogin), loginCompany);
authRouter.post(`${AUTH}/company-logged-in`, passport.authenticate("jwt", { session: false }), isLoggedInCompany);

export default authRouter;
