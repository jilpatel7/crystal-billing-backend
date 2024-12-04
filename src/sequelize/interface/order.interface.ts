import { ICompany } from "./companies.interface";
import { IOrderDetails } from "./order-details.interface";
import { IParty } from "./parties.interface";

export interface IOrder {
  id: number;
  party_id: number;
  company_id: number;
  no_of_lots: number;
  jagad_no: string;
  received_at: Date;
  delivered_at: Date;
  delivered_by: number;
  //TODO : make this as enum
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  company: ICompany;
  party: IParty;
  order_details: IOrderDetails[];
}
export interface IOrderCreate extends Omit<IOrder, 'id' | 'delivered_at' | 'jagad_no' | 'delivered_by' | 'created_at' | 'updated_at' | 'deleted_at'> { }