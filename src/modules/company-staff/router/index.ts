import { Router } from 'express';
import passport, { validationMiddleware } from '../../../middleware';
import { idSchema, companyStaffSchema } from '../validation-schema';
import {
  createCompanyStaff,
  deleteCompanyStaff,
  getAllCompanyStaff,
  getCompanyStaff,
  updateCompanyStaff,
} from '../controller';

const companyStaffRouter: Router = Router();

const COMPANY_STAFF = '/company-staff';
companyStaffRouter.post(
  `${COMPANY_STAFF}/create`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(companyStaffSchema),
  createCompanyStaff
);
companyStaffRouter.put(
  `${COMPANY_STAFF}/update`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(companyStaffSchema, { isUpdate: true }),
  updateCompanyStaff
);
companyStaffRouter.post(
  `${COMPANY_STAFF}/get`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(idSchema),
  getCompanyStaff
);
companyStaffRouter.post(
  `${COMPANY_STAFF}/get/all`,
  passport.authenticate('jwt', { session: false }),
  getAllCompanyStaff
);
companyStaffRouter.post(
  `${COMPANY_STAFF}/delete`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(idSchema),
  deleteCompanyStaff
);

export default companyStaffRouter;
