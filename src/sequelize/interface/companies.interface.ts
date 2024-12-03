export interface ICompany {
  id: number;
  gstin_no: string;
  name: string;
  email: string;
  password: string;
  personal_phone: string;
  office_phone: string;
  otp: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
export interface ICompanyCreate extends Omit<ICompany, 'id' | 'personal_phone' | 'created_at' | 'updated_at' | 'deleted_at'> { }
