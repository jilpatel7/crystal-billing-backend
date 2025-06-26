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
import puppeteer from 'puppeteer';

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

function generateHTML(data: Order[], billPeriod?: string): string {
  const billData = data.map((order) => {
    const date = new Date(order.dataValues.received_at).toLocaleDateString('en-GB'); // 'dd-mm-yyyy'
    const jangadNo = order.dataValues.jagad_no;
    const orderDetails = order.order_details;

    const lot = orderDetails.length;

    let caret = 0;
    let amount = 0;

    orderDetails.forEach((detail) => {
      const c = detail.dataValues.total_caret;
      const p = detail.dataValues.price_per_caret ?? 0;
      caret += c;
      amount += c * p;
    });

    return {
      date,
      jangadNo,
      lot,
      caret: parseFloat(caret.toFixed(2)),
      amount: parseFloat(amount.toFixed(2)),
    };
  });

  // const billData = [
  //   { date: '01-08-2023', jangadNo: 183, lot: 7, caret: 89.37, amount: 1519.29 },
  //   { date: '02-08-2023', jangadNo: 188, lot: 13, caret: 121.6, amount: 2067.2 },
  //   { date: '03-08-2023', jangadNo: 215, lot: 17, caret: 153.11, amount: 2602.87 },
  //   { date: '04-08-2023', jangadNo: 306, lot: 18, caret: 111.16, amount: 1889.72 },
  //   { date: '05-08-2023', jangadNo: 316, lot: 11, caret: 79.34, amount: 1348.78 },
  //   { date: '07-08-2023', jangadNo: 332, lot: 9, caret: 47.41, amount: 805.97 },
  //   { date: '08-08-2023', jangadNo: 342, lot: 11, caret: 54.69, amount: 929.73 },
  //   { date: '09-08-2023', jangadNo: 357, lot: 7, caret: 31.08, amount: 528.36 },
  //   { date: '10-08-2023', jangadNo: 363, lot: 5, caret: 14.68, amount: 249.56 },
  //   { date: '11-08-2023', jangadNo: 377, lot: 2, caret: 4.03, amount: 68.51 },
  //   { date: '12-08-2023', jangadNo: 400, lot: 2, caret: 37.88, amount: 643.96 },
  //   { date: '13-08-2023', jangadNo: 249, lot: 2, caret: 28.77, amount: 489.09 },
  //   { date: '14-08-2023', jangadNo: 258, lot: 6, caret: 92.83, amount: 1578.11 },
  //   { date: '15-08-2023', jangadNo: 272, lot: 10, caret: 106.91, amount: 1817.47 },
  //   { date: '16-08-2023', jangadNo: 289, lot: 12, caret: 102.57, amount: 1743.69 },
  //   { date: '17-08-2023', jangadNo: 609, lot: 9, caret: 72.23, amount: 1227.91 },
  //   { date: '18-08-2023', jangadNo: 625, lot: 11, caret: 66.02, amount: 1122.34 },
  //   { date: '19-08-2023', jangadNo: 637, lot: 6, caret: 37.01, amount: 629.17 },
  //   { date: '21-08-2023', jangadNo: 659, lot: 5, caret: 21.46, amount: 364.82 },
  //   { date: '22-08-2023', jangadNo: 678, lot: 7, caret: 67.79, amount: 1152.43 },
  //   { date: '23-08-2023', jangadNo: 689, lot: 9, caret: 98.22, amount: 1669.74 },
  //   { date: '24-08-2023', jangadNo: 715, lot: 14, caret: 103.93, amount: 1766.81 },
  //   { date: '25-08-2023', jangadNo: 807, lot: 12, caret: 95.44, amount: 1622.48 },
  //   { date: '26-08-2023', jangadNo: 821, lot: 9, caret: 63.95, amount: 1087.15 },
  //   { date: '27-08-2023', jangadNo: 836, lot: 7, caret: 45.76, amount: 777.92 },
  //   { date: '28-08-2023', jangadNo: 843, lot: 8, caret: 44.43, amount: 755.31 },
  //   { date: '29-08-2023', jangadNo: 855, lot: 6, caret: 35.33, amount: 600.61 },
  //   { date: '31-08-2023', jangadNo: 869, lot: 5, caret: 14.25, amount: 242.25 },
  // ];

  const totalLot = billData.reduce((sum, item) => sum + item.lot, 0);
  const totalCaret = billData.reduce((sum, item) => sum + item.caret, 0);
  const totalAmount = billData.reduce((sum, item) => sum + item.amount, 0);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Bill</title>
      <style>
        body {
          min-height: 100vh;
          background-color: white;
          padding: 2rem 1rem;
          margin: 0;
          font-family: Arial, sans-serif;
        }
        .bill-container {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }
        .bill-header {
          background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
          color: #374151;
          padding: 1.5rem 2rem;
          text-align: center;
          border-bottom: 2px solid #e5e7eb;
          position: relative;
        }
        .bill-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 3px;
          background: linear-gradient(90deg, #d1d5db 0%, #9ca3af 50%, #d1d5db 100%);
          border-radius: 0 0 3px 3px;
        }
        .company-name {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          letter-spacing: 3px;
          color: #111827;
          text-transform: uppercase;
          font-family: 'Georgia', serif;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          line-height: 1.1;
        }
        .company-subtitle {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.5rem;
          display: inline-block;
        }
        .company-details {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #4b5563;
          max-width: 400px;
          margin: 0 auto;
          font-weight: 400;
        }
        .company-details strong {
          color: #374151;
          font-weight: 600;
        }
        .address-line {
          margin-bottom: 0.2rem;
        }
        .phone-line {
          margin-top: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        .bill-info {
          background: #f9fafb;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .bill-title {
          font-size: 1.8rem;
          font-weight: bold;
          color: #111827;
          margin-bottom: 1rem;
        }
        .bill-period {
          color: #6b7280;
          font-size: 0.95rem;
        }
        .table-container {
          padding: 2rem;
        }
        .bill-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        .bill-table th {
          background: #f3f4f6;
          color: #374151;
          padding: 1rem 0.75rem;
          text-align: center;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border-bottom: 1px solid #e5e7eb;
        }
        .bill-table td {
          padding: 0.75rem;
          text-align: center;
          border-bottom: 1px solid #f3f4f6;
          color: #374151;
        }
        .bill-table tbody tr:hover {
          background-color: #f9fafb;
          transition: background-color 0.2s ease;
        }
        .bill-table tbody tr:nth-child(even) {
          background-color: #fafbfc;
        }
        .total-row {
          background: #f3f4f6 !important;
          color: #111827 !important;
          font-weight: bold;
          font-size: 0.95rem;
          border-top: 2px solid #d1d5db;
        }
        .total-row td {
          border-bottom: none !important;
          padding: 1rem 0.75rem;
        }
        .amount-cell {
          font-weight: 500;
          color: #374151;
        }
        .total-amount {
          color: #111827 !important;
          font-size: 1.1rem;
          font-weight: bold;
        }
        .watermark {
          position: relative;
          overflow: hidden;
        }
        .watermark::before {
          content: 'PAID';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-15deg);
          font-size: 8rem;
          font-weight: bold;
          color: rgba(229, 231, 235, 0.3);
          z-index: 1;
          pointer-events: none;
        }
        .table-content {
          position: relative;
          z-index: 2;
        }
      </style>
    </head>
    <body>
      <div class="bill-container">
        <div class="bill-header">
          <h1 class="company-name">DIVYA LASER</h1>
          <div class="company-subtitle">Precision • Quality • Excellence</div>
          <div class="company-details">
            <div class="address-line"><strong>Address:</strong> G/1829 Laxminarayan Chamber</div>
            <div class="address-line">Opp Dalgiya Mohallo, Mahidharpura, Surat</div>
            <div class="phone-line"><strong>Office:</strong> 0261 2608263</div>
          </div>
        </div>

        <div class="bill-info">
          <h2 class="bill-title">Bhakti Dimonds</h2>
          <p class="bill-period">Bill Period: [01/08/2023 - 31/08/2023]</p>
        </div>

        <div class="table-container watermark">
          <div class="table-content">
            <table class="bill-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Jangad No.</th>
                  <th>Lot</th>
                  <th>Caret</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <!-- Repeat this row for each item -->
                ${billData
                  .map(
                    (item) => `
                <tr>
                  <td>${item.date}</td>
                  <td>${item.jangadNo}</td>
                  <td>${item.lot}</td>
                  <td>${item.caret}</td>
                  <td class="amount-cell">₹${item.amount.toFixed(2)}</td>
                </tr>
                  `
                  )
                  .join('')}

                <!-- Add more rows as needed -->
                <tr class="total-row">
                  <td><strong>Total Bill</strong></td>
                  <td><strong>-</strong></td>
                  <td><strong>${totalLot}</strong></td>
                  <td><strong>${totalCaret}</strong></td>
                  <td class="total-amount"><strong>₹${totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </body>
    </html>

  `;
}

export const generateBill = async (req: Request, res: Response) => {
  try {
    let { sort = 'id', order = 'ASC', search = '', status, dateFrom, dateTo } = req.body;

    const company_id = +(req.user || 0);

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
    };

    const data = await Order.findAndCountAll(options);

    const html = generateHTML(data.rows);

    const browser = await puppeteer.launch({ headless: 'shell' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=bill.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: ORDER_RESPONSE.ORDER_GENERATE_BILL,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
