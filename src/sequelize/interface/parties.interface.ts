export interface IParty {
  id: number;
  gstin_no: string;
  company_id: number;
  name: string;
  email: string;
  personal_phone: string;
  office_phone: string;
  logo: string;
  price_per_caret: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
export interface IPartyCreate extends Omit<IParty, 'id' | 'personal_phone' | 'email' | 'created_at' | 'updated_at' | 'deleted_at' | 'logo'> { }