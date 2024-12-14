import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import generalResponse from "../helper";
import { JWT_SECRET } from "../config";
import { Strategy } from "passport-jwt";
import passport from "passport";

export const validationMiddleware = (schema: ObjectSchema, context?: Joi.Context) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false, context },);
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

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};
const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET,
};
const jwtStrategy = new Strategy(options, (payload, next) => {
  if (payload) {
    return next(null, payload.id);
  } else {
    return next(null, false);
  }
});
export default passport.use(jwtStrategy);

