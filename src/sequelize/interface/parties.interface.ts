import { ICompany } from "./companies.interface";
import { IOrder } from "./order.interface";
import { IPartyAddress } from "./party-address.interface";

export interface IParty {
  id?: number;
  gstin_no?: string;
  company_id: number;
  name: string;
  email?: string;
  personal_phone?: string;
  office_phone: string;
  logo?: string;
  price_per_caret: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  company?: ICompany;
  party_addresses?: IPartyAddress;
  orders?: IOrder[];
  companies_with_orders?: ICompany[]
}