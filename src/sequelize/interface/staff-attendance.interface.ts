import { ICompanyStaff } from './company-staff.interface';

export interface IStaffAttendance {
  id?: number;
  staff_id: number;
  attendance_date: Date;
  status: string;
  reason: string;
  created_at?: Date;
  updated_at?: Date;

  staff?: ICompanyStaff;
}
