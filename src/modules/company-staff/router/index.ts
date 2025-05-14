import { Router } from 'express';
import passport, { validationMiddleware } from '../../../middleware';
import { idSchema, companyStaffSchema } from '../validation-schema';
import {
  createCompanyStaff,
  deleteCompanyStaff,
  getAllCompanyStaff,
  getAllCompanyStaffIdsAndNames,
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
companyStaffRouter.get(
  `${COMPANY_STAFF}/get`,
  passport.authenticate('jwt', { session: false }),
  getCompanyStaff
);
companyStaffRouter.get(
  `${COMPANY_STAFF}/get/all`,
  passport.authenticate('jwt', { session: false }),
  getAllCompanyStaff
);
companyStaffRouter.get(
  `${COMPANY_STAFF}/get/allIdsAndNames`,
  passport.authenticate('jwt', { session: false }),
  getAllCompanyStaffIdsAndNames
);
companyStaffRouter.delete(
  `${COMPANY_STAFF}/delete`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(idSchema),
  deleteCompanyStaff
);

export default companyStaffRouter;
