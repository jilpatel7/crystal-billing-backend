import Joi from 'joi';

export const companyUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  email: Joi.string().trim().email().max(50).required(),
  gstin_no: Joi.string().trim().allow('').optional(),
  office_phone: Joi.string().trim().required(),
  personal_phone: Joi.string().trim().allow('').optional(),
});

export const changePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(4).required(),
});
