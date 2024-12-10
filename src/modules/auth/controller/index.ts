import { Request, Response } from "express";
import Company from "../../../sequelize/models/company";
import generalResponse from "../../../helper";
import { AUTH_RESPONSE } from "../enum";
import { JWT_SECRET } from "../../../config";
import jwt from "jsonwebtoken";

export const loginCompany = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const company = await Company.findOne({
      where: {
        email: email
      }
    })
    if (!company) {
      return generalResponse({
        message: AUTH_RESPONSE.COMPANY_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure'
      })
    }
    // const isPasswordMatch = await argon2.verify(company.password, password)
    const isPasswordMatch = password === company.password

    if (isPasswordMatch) {
      const token = jwt.sign({ id: company.id }, JWT_SECRET, { expiresIn: "1d" })
      res.cookie("token", token)
      return generalResponse({
        data: company,
        response: res,
        message: AUTH_RESPONSE.LOGIN_SUCCESS,
        response_type: 'success',
        statusCode: 200
      })
    }
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: AUTH_RESPONSE.LOGIN_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure'
    })
  }
};
export const isLoggedInCompany = async (req: Request, res: Response) => {
  try {
    const id = req.user
    const company = await Company.findOne({
      where: {
        id: id
      }
    })
    if (!company) {
      return generalResponse({
        message: AUTH_RESPONSE.COMPANY_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure'
      })
    }
    return generalResponse({
      data: company,
      response: res,
      message: AUTH_RESPONSE.LOGIN_SUCCESS,
      response_type: 'success',
      statusCode: 200
    })
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: AUTH_RESPONSE.LOGIN_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure'
    })
  }
}