import { Router } from "express";
import { loginCompany } from "../controller";
import { validationMiddleware } from "../../../middleware";
import { companyLogin } from "../validation-schema";

const authRouter: Router = Router();

const AUTH = "/auth"
authRouter.post(`${AUTH}/login`, validationMiddleware(companyLogin), loginCompany);

export default authRouter;
