import { Request, response, Response } from "express";
import generalResponse from "../../../helper";
import { ORDER_RESPONSE } from "../enum";
import { IOrderStatus } from "../../../sequelize/interface/order-details.interface";
import Order from "../../../sequelize/models/order";
import _, { sortBy } from "lodash";
import OrderDetails from "../../../sequelize/models/order-details";
import { FindAndCountOptions, Op, Sequelize, where } from "sequelize";
import Party from "../../../sequelize/models/party";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 1);
    const { party_id, jagad_no, received_at, order_details, status } = req.body;
    
    const result = await Order.create({
      party_id: party_id,
      company_id: company_id,
      no_of_lots: order_details.length,
      jagad_no: jagad_no,
      received_at: received_at,
      status: status,
      order_details: order_details
    }, {
      include: [
        {
          model: OrderDetails
        },
      ],
    });
    
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

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { id, party_id, no_of_lots, jagad_no, delivered_by, delivered_at, received_at, order_details } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return generalResponse({
        message: ORDER_RESPONSE.ORDER_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: "failure"
      })
    }
    
    await Order.update({
      party_id: party_id,
      no_of_lots: no_of_lots,
      jagad_no: jagad_no,
      received_at: received_at,
      delivered_by,
      delivered_at,
    }, {
      where: {
        id, company_id
      }
    });

    if (Array.isArray(order_details)) {
      for (const detail of order_details) {
        const { id: detailId, isDeleted, no_of_diamonds, total_caret, price_per_caret } = detail;

        if (!detailId) {          
          // Create new order detail
          await OrderDetails.create({
            order_id: id,
            no_of_diamonds,
            total_caret,
            price_per_caret,
          });
        } else if (isDeleted) {
          // Delete existing order detail
          await OrderDetails.destroy({
            where: { id: detailId },
          });
        } else {
          // Update existing order detail
          await OrderDetails.update(
            { no_of_diamonds, total_caret, price_per_caret },
            { where: { id: detailId } }
          );
        }
      }
    }

    // Fetch updated order with details
    const updatedOrder = await Order.findOne({
      where: { id },
      include: [{ model: OrderDetails }],
    });    

    return generalResponse({
      message: ORDER_RESPONSE.ORDER_UPDATED,
      response: res,
      data: updatedOrder,
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

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const order = await Order.findByPk(id)
    if (!order) {
      return generalResponse({
        message: ORDER_RESPONSE.ORDER_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: "failure"
      })
    }
    await order.destroy();

    return generalResponse({
      message: ORDER_RESPONSE.ORDER_DELETED,
      response: res,
      data: null,
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

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    let {
      sort = "id",         
      order = "DESC",      
      page = 1,            
      limit = 10,          
      search = "",
      status,
      dateFrom,
      dateTo,
    } = req.query;

    const company_id = +(req.user || 0);

    page = +page;
    limit = +limit;

    const offset = (page - 1) * limit;

    const options: FindAndCountOptions = {
      distinct: true,
      col: 'id',
      include: [
        { model: OrderDetails, required: true },
        {
          model: Party,
          required: true, 
        },
      ],
      where: {
        company_id: company_id,
        ...(status && { status }),
        [Op.and]: [
          dateFrom && dateTo
            ? { received_at: { [Op.between]: [dateFrom, dateTo] } }
            : dateFrom
            ? { received_at: { [Op.gte]: dateFrom } }
            : dateTo
            ? { received_at: { [Op.lte]: dateTo } }
            : null,
        ],
        [Op.or]: [
          { jagad_no: { [Op.like]: `%${search}%` } },
          { status: { [Op.like]: `%${search}%` } },
          {
            "$Party.name$": {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      } as any,
      order: [[sort as string, order as "ASC" | "DESC"]],
      limit: limit,
      offset: offset
    };

    const data = await Order.findAndCountAll(options);

    const responseData = {
      totalRecords: data.count,                  // Total number of records
      totalPages: Math.ceil(data.count / limit), // Total pages
      currentPage: page,                         // Current page
      data: data.rows,                           // Paginated data
    };

    return generalResponse({
      message: ORDER_RESPONSE.ORDER_FETCH_SUCCESS,
      response: res,
      data: responseData,
    });
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


