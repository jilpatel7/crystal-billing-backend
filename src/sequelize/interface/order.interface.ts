import { ICompany } from "./companies.interface";
import { IOrderDetails, IOrderStatus } from "./order-details.interface";
import { IParty } from "./parties.interface";

export interface IOrder {
  id?: number;
  party_id: number;
  company_id: number;
  no_of_lots: number;
  jagad_no?: string;
  received_at: Date;
  delivered_at?: Date;
  delivered_by?: number;
  status: IOrderStatus;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;

  company?: ICompany;
  party?: IParty;
  order_details?: IOrderDetails[];
}