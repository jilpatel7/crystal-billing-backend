import { IOrder } from "./order.interface";

export enum IOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DELIVERED = 'delivered'
}
export interface IOrderDetails {
  id?: number;
  order_id?: number;
  no_of_diamonds: number;
  total_caret: number;
  price_per_caret?: number;
  status?: IOrderStatus;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  order?: IOrder;
}