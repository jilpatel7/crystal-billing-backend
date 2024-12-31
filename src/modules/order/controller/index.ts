import { Request, Response } from "express";
import generalResponse from "../../../helper";
import { ORDER_RESPONSE } from "../enum";
import { IOrderStatus } from "../../../sequelize/interface/order-details.interface";
import Order from "../../../sequelize/models/order";
import _ from "lodash";
import OrderDetails from "../../../sequelize/models/order-details";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { party_id, no_of_lots, jagad_no, received_at, order_details } = req.body();
    // const result = await Order.create({
    //   party_id: 1,
    //   company_id: company_id,
    //   no_of_lots: 5,
    //   jagad_no: "222",
    //   received_at: new Date(),
    //   status: IOrderStatus.PENDING,
    //   order_details: [
    //     {
    //       no_of_diamonds: 55,
    //       total_caret: 25,
    //       price_per_caret: 33,
    //       status: IOrderStatus.PENDING
    //     }
    //   ]
    // })
    const result = await Order.create({
      party_id: party_id,
      company_id: company_id,
      no_of_lots: no_of_lots,
      jagad_no: jagad_no,
      received_at: received_at,
      status: IOrderStatus.PENDING,
      order_details: order_details
    }, {include: OrderDetails});
    
    const data = JSON.parse(JSON.stringify(result));
    return generalResponse({
      message: ORDER_RESPONSE.ORDER_CREATED,
      response: res,
      data: _.omit(data, ['company_id', 'created_at', 'updated_at']),
    })
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: ORDER_RESPONSE.ORDER_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};