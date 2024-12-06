import Joi from "joi";

export const companyLogin = Joi.object({
  email: Joi.string().email().max(50),
  password: Joi.string().required(),
});