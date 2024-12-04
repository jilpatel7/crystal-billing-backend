import { IOrder } from "./order.interface";

export interface IOrderDetails {
  id: number;
  order_id: number;
  no_of_diamonds: number;
  total_caret: number;
  price_per_caret: number;
  //TODO : make this as enum
  status: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  order: IOrder;
}
export interface IOrderDetailsCreate extends Omit<IOrderDetails, 'id' | 'created_at' | 'updated_at' | 'deleted_at'> { }