import { Request, response, Response } from 'express';
import generalResponse from '../../../helper';
import { ORDER_LOT_RESPONSE, ORDER_RESPONSE } from '../enum';
import { IOrderStatus } from '../../../sequelize/interface/order-details.interface';
import Order from '../../../sequelize/models/order';
import _, { sortBy } from 'lodash';
import OrderDetails from '../../../sequelize/models/order-details';
import { FindAndCountOptions, Op, Sequelize, where } from 'sequelize';
import Party from '../../../sequelize/models/party';
import db from '../../../sequelize/models';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 1);
    const { party_id, jagad_no, received_at, order_details, status } = req.body;

    const result = await Order.create(
      {
        party_id: party_id,
        company_id: company_id,
        no_of_lots: order_details.length,
        jagad_no: jagad_no,
        received_at: received_at,
        status: status,
        order_details: order_details,
      },
      {
        include: [
          {
            model: OrderDetails,
          },
        ],
      }
    );

    const data = JSON.parse(JSON.stringify(result));
    return generalResponse({
      message: ORDER_RESPONSE.ORDER_CREATED,
      response: res,
      data: _.omit(data, ['company_id', 'created_at', 'updated_at']),
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

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const transaction = await db.connect().transaction();
    const company_id = +(req.user || 0);
    const {
      id,
      party_id,
      no_of_lots,
      jagad_no,
      delivered_by,
      delivered_at,
      received_at,
      order_details,
      removed_lot_ids,
      status,
    } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return generalResponse({
        message: ORDER_RESPONSE.ORDER_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    await Order.update(
      {
        party_id: party_id,
        no_of_lots: no_of_lots,
        jagad_no: jagad_no,
        received_at: received_at,
        status: status,
        delivered_by: delivered_by,
        delivered_at: delivered_at,
      },
      {
        where: {
          id,
          company_id,
        },
        transaction,
      }
    );

    if (Array.isArray(order_details)) {
      for (const detail of order_details) {
        const { id: detailId, no_of_diamonds, total_caret, price_per_caret, status } = detail;

        if (detailId) {
          // Update existing order detail
          await OrderDetails.update(
            { no_of_diamonds, total_caret, price_per_caret, status },
            { where: { id: detailId }, transaction }
          );
        } else {
          // Create new order detail
          await OrderDetails.create(
            {
              order_id: id,
              no_of_diamonds,
              total_caret,
              price_per_caret,
              status,
            },
            { transaction }
          );
        }
      }
    }

    // Delete addresses by ID
    if (Array.isArray(removed_lot_ids) && removed_lot_ids.length > 0) {
      await OrderDetails.destroy({
        where: {
          id: removed_lot_ids,
          order_id: id,
        },
        transaction,
      });
    }

    await transaction.commit();

    return generalResponse({
      message: ORDER_RESPONSE.ORDER_UPDATED,
      response: res,
      data: null,
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

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const order = await Order.findByPk(id);
    if (!order) {
      return generalResponse({
        message: ORDER_RESPONSE.ORDER_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    await order.destroy();

    return generalResponse({
      message: ORDER_RESPONSE.ORDER_DELETED,
      response: res,
      data: null,
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

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    let {
      sort = 'id',
      order = 'DESC',
      page = 1,
      limit = 10,
      search = '',
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
            '$Party.name$': {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      } as any,
      order: [[sort as string, order as 'ASC' | 'DESC']],
      limit: limit,
      offset: offset,
    };

    const data = await Order.findAndCountAll(options);

    const responseData = {
      totalRecords: data.count, // Total number of records
      totalPages: Math.ceil(data.count / limit), // Total pages
      currentPage: page, // Current page
      data: data.rows, // Paginated data
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

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const order = await Order.findByPk(Number(id), {
      include: [
        {
          model: OrderDetails,
        },
      ],
    });
    if (!order) {
      return generalResponse({
        message: ORDER_RESPONSE.ORDER_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    return generalResponse({
      message: ORDER_RESPONSE.ORDER_FETCH_SUCCESS,
      response: res,
      data: order,
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

export const createLot = async (req: Request, res: Response) => {
  try {
    const lot = req.body;
    console.log(lot);
    const order = await Order.findByPk(lot.order_id);
    if (!order) {
      return generalResponse({
        message: ORDER_RESPONSE.ORDER_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    const newCreatedLot = await OrderDetails.create({
      order_id: order.id,
      no_of_diamonds: lot.no_of_diamonds,
      total_caret: lot.total_caret,
      price_per_caret: lot.price_per_caret,
      status: lot.status,
    });

    return generalResponse({
      message: ORDER_LOT_RESPONSE.ORDER_LOT_CREATED,
      response: res,
      data: newCreatedLot,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: ORDER_LOT_RESPONSE.ORDER_LOT_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const deleteLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const lot = await OrderDetails.findByPk(id);
    if (!lot) {
      return generalResponse({
        message: ORDER_LOT_RESPONSE.ORDER_LOT_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    await lot.destroy();

    return generalResponse({
      message: ORDER_LOT_RESPONSE.ORDER_LOT_DELETED,
      response: res,
      data: null,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: ORDER_LOT_RESPONSE.ORDER_LOT_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const updateLot = async (req: Request, res: Response) => {
  try {
    const { id, no_of_diamonds, total_caret, price_per_caret, status } = req.body;
    const lot = await OrderDetails.findByPk(id);
    if (!lot) {
      return generalResponse({
        message: ORDER_LOT_RESPONSE.ORDER_LOT_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    await OrderDetails.update(
      {
        no_of_diamonds,
        total_caret,
        price_per_caret,
        status,
      },
      {
        where: {
          id,
        },
      }
    );

    return generalResponse({
      message: ORDER_LOT_RESPONSE.ORDER_LOT_UPDATED,
      response: res,
      data: lot,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: ORDER_LOT_RESPONSE.ORDER_LOT_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
