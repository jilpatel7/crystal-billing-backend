import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import generalResponse from "../helper";

export const validationMiddleware = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return generalResponse({
        response: res,
        message: error.message,
        response_type: "failure",
        statusCode: 400,
      });
    }
    next();
  };
};

