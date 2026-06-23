import { Router } from 'express';
import passport, { validationMiddleware } from '../../../middleware';
import { changeCompanyPassword, updateCompany } from '../controller';
import { changePasswordSchema, companyUpdateSchema } from '../validation-schema';

const companyRouter: Router = Router();

const COMPANY = '/company';

companyRouter.post(
  `${COMPANY}/update`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(companyUpdateSchema),
  updateCompany
);

companyRouter.post(
  `${COMPANY}/change-password`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(changePasswordSchema),
  changeCompanyPassword
);

export default companyRouter;
