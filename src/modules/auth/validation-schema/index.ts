import Joi from "joi";

export const companyLogin = Joi.object({
  email: Joi.string().trim().email().max(50).required(),
  password: Joi.string().trim().required(),
});