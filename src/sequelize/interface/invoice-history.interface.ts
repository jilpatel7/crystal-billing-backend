import { IParty } from "./parties.interface";

export interface IInvoiceHistory {
  id?: number;
  party_id: number;
  start_date: Date
  end_date: Date
  total_amount: number
  paid_amount?: number
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date

  party?: IParty;
}