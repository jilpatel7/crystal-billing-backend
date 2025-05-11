import { Request, Response } from 'express';
import generalResponse from '../../../helper';
import { COMPANY_STAFF_RESPONSE } from '../enum';
import _ from 'lodash';
import { removeKeys } from '../../../utils';
import CompanyStaff from '../../../sequelize/models/company-staff';
import { Op } from 'sequelize';

export const createCompanyStaff = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { address, age, first_name, gender, last_name, primary_phone, secondary_phone } =
      req.body;
    const result = await CompanyStaff.create({
      address,
      age,
      first_name,
      gender,
      last_name,
      primary_phone,
      secondary_phone,
      company_id,
    });
    const data = result.toJSON();
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_CREATED,
      response: res,
      data: removeKeys(data, ['company_id', 'created_at', 'updated_at']),
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const updateCompanyStaff = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { id, address, age, first_name, gender, last_name, primary_phone, secondary_phone } =
      req.body;
    const staff = await CompanyStaff.findByPk(id);
    if (!staff) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    const result = await CompanyStaff.update(
      {
        address,
        age,
        first_name,
        gender,
        last_name,
        primary_phone,
        secondary_phone,
      },
      {
        where: {
          id,
          company_id,
        },
      }
    );

    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_UPDATED,
      response: res,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const deleteCompanyStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const party = await CompanyStaff.findByPk(id);
    if (!party) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    const result = await CompanyStaff.destroy({
      where: { id },
    });
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_DELETED,
      response: res,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const getCompanyStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const party = await CompanyStaff.findByPk(id);
    if (!party) {
      return generalResponse({
        message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FETCH_SUCCESS,
      response: res,
      data: party,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const getAllCompanyStaff = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    let { sort = 'id', order = 'DESC', page = 1, limit = 10, search = '' } = req.query;   
    
    page = +page;
    limit = +limit;

    const offset = (page - 1) * limit;
    
    const staff = await CompanyStaff.findAndCountAll({
      attributes: [
        'id',
        'address',
        'age',
        'first_name',
        'gender',
        'last_name',
        'primary_phone',
        'secondary_phone',
        'created_at',
        'updated_at',
      ],
      where: {
        company_id,
        [Op.or]: [
          { last_name: { [Op.like]: `%${(search as string).toLowerCase()}%` } },
          { first_name: { [Op.like]: `%${(search as string).toLowerCase()}%` } },
        ],
      },
      order: [[sort as string, order as "ASC" | "DESC"]],
      limit: limit,
      offset: offset
    });

    const responseData = {
      totalRecords: staff.count, // Total number of records
      totalPages: Math.ceil(staff.count / limit), // Total pages
      currentPage: page, // Current page
      data: staff.rows, // Paginated data
    };

    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FETCH_SUCCESS,
      response: res,
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const getAllCompanyStaffIdsAndNames = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const staff = await CompanyStaff.findAll({
      attributes: ['id', 'first_name', 'last_name'],
      where: {
        company_id,
      },
    });

    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FETCH_SUCCESS,
      response: res,
      data: staff,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: COMPANY_STAFF_RESPONSE.COMPANY_STAFF_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
}
