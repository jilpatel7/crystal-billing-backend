import { ICompanyStaff } from "./company-staff.interface";
import { IOrder } from "./order.interface";
import { IParty } from "./parties.interface";

export interface ICompany {
  id?: number;
  gstin_no: string;
  name: string;
  email: string;
  password: string;
  personal_phone?: string;
  office_phone: string;
  otp: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  parties?: IParty[];
  company_staffs?: ICompanyStaff[];
  orders?: IOrder[];
  parties_with_orders?: IParty[];
}