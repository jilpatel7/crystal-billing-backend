import { Request, Response } from 'express';
import generalResponse from '../../../helper';
import { PARTY_RESPONSE } from '../enum';
import Party from '../../../sequelize/models/party';
import { Op } from 'sequelize';

export const createParty = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { gstin_no, name, email, personal_phone, office_phone, logo, price_per_caret } = req.body;
    const result = await Party.create({
      company_id,
      name,
      office_phone,
      price_per_caret,
      email,
      gstin_no,
      logo,
      personal_phone,
    });
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_CREATED,
      response: res,
      data: result,
    })
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const updateParty = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { id, gstin_no, name, email, personal_phone, office_phone, logo, price_per_caret } = req.body;
    const party = await Party.findByPk(id)
    if (!party) {
      return generalResponse({
        message: PARTY_RESPONSE.PARTY_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: "failure"
      })
    }
    const result = await Party.update({
      email,
      gstin_no, logo, office_phone, name, personal_phone, price_per_caret
    }, {
      where: {
        id, company_id
      }
    })
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_UPDATED,
      response: res,
      data: result,
    })
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const deleteParty = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const party = await Party.findByPk(id)
    if (!party) {
      return generalResponse({
        message: PARTY_RESPONSE.PARTY_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: "failure"
      })
    }
    const result = await Party.destroy({
      where: { id }
    })
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_DELETED,
      response: res,
      data: result,
    })
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const getParty = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const party = await Party.findByPk(id)
    if (!party) {
      return generalResponse({
        message: PARTY_RESPONSE.PARTY_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: "failure"
      })
    }
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FETCH_SUCCESS,
      response: res,
      data: party,
    })
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const getAllParty = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { limit = 10, offset = 0, search = '', columnToOrder = 'id', orderBy = 'desc' } = req.body;
    const party = await Party.findAndCountAll({
      attributes: ['id','name', 'email', 'personal_phone', 'office_phone', 'price_per_caret',],
      where: {
        company_id,
        name: { [Op.like]: `%${search.toLowerCase()}%` }
      },
      limit,
      offset,
      order: [[columnToOrder || 'id', orderBy || 'desc']]
    })
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FETCH_SUCCESS,
      response: res,
      data: party,
    })
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: PARTY_RESPONSE.PARTY_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
