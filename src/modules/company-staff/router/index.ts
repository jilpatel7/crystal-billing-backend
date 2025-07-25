import { Router } from 'express';
import passport, { validationMiddleware } from '../../../middleware';
import {
  idSchema,
  companyStaffSchema,
  staffAttendanceSchema,
  staffAttendanceSchemaForLeaveRequest,
} from '../validation-schema';
import {
  createCompanyStaff,
  deleteCompanyStaff,
  getAllCompanyStaff,
  getAllCompanyStaffIdsAndNames,
  getCompanyStaff,
  getStaffAttendance,
  getStaffAttendanceSummary,
  markStaffAttendance,
  markStaffLeaveRequest,
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

companyStaffRouter.post(
  `${COMPANY_STAFF}/attendance/mark`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(staffAttendanceSchema),
  markStaffAttendance
);

companyStaffRouter.get(
  `${COMPANY_STAFF}/attendance/get`,
  passport.authenticate('jwt', { session: false }),
  getStaffAttendance
);

companyStaffRouter.get(
  `${COMPANY_STAFF}/attendance/summary`,
  passport.authenticate('jwt', { session: false }),
  getStaffAttendanceSummary
);

companyStaffRouter.post(
  `${COMPANY_STAFF}/attendance/leave-request`,
  passport.authenticate('jwt', { session: false }),
  validationMiddleware(staffAttendanceSchemaForLeaveRequest),
  markStaffLeaveRequest
);

export default companyStaffRouter;
