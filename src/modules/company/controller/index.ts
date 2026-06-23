import { Request, Response } from 'express';
import generalResponse from '../../../helper';
import Company from '../../../sequelize/models/company';
import { removeKeys } from '../../../utils';

export const updateCompany = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { name, email, gstin_no, office_phone, personal_phone } = req.body;

    const company = await Company.findByPk(company_id);
    if (!company) {
      return generalResponse({
        message: 'Company not found!',
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    await Company.update(
      { name, email, gstin_no, office_phone, personal_phone },
      { where: { id: company_id } }
    );

    const updated = await Company.findByPk(company_id);
    const data = updated ? removeKeys(updated.toJSON(), ['password', 'otp']) : null;

    return generalResponse({
      message: 'Company profile updated successfully!',
      response: res,
      data,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: 'Something went wrong! Please try again later.',
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};

export const changeCompanyPassword = async (req: Request, res: Response) => {
  try {
    const company_id = +(req.user || 0);
    const { current_password, new_password } = req.body;

    const company = await Company.findByPk(company_id);
    if (!company) {
      return generalResponse({
        message: 'Company not found!',
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }

    // NOTE: passwords are currently stored/compared in plain text, matching the
    // existing login flow. Hashing should be re-enabled as a security follow-up.
    if (company.password !== current_password) {
      return generalResponse({
        message: 'Current password is incorrect.',
        response: res,
        statusCode: 401,
        response_type: 'failure',
      });
    }

    await Company.update({ password: new_password }, { where: { id: company_id } });

    return generalResponse({
      message: 'Password changed successfully!',
      response: res,
      data: null,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: 'Something went wrong! Please try again later.',
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
