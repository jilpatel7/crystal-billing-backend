export interface ICompanyStaff {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  primary_phone: string;
  secondary_phone: string;
  address: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
export interface ICompanyStaffCreate extends Omit<ICompanyStaff, 'id' | 'secondary_phone' | 'created_at' | 'updated_at' | 'deleted_at'> { }