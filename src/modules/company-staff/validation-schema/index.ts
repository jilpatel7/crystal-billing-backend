import Joi from 'joi';

export const companyStaffSchema = Joi.object({
  id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  first_name: Joi.string().trim().min(1).max(50).required(),
  last_name: Joi.string().trim().min(1).max(50).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  age: Joi.number().integer().min(0).max(120).required(),
  primary_phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
  secondary_phone: Joi.string()
    .pattern(/^\d{10}$/)
    .optional()
    .allow(''),
  address: Joi.string().trim().min(1).max(255).required(),
});

export const idSchema = Joi.object({
  id: Joi.number().required(),
});
