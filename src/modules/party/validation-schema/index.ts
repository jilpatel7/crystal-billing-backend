import Joi from "joi";

export const partySchema = Joi.object({
  id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  gstin_no: Joi.string().trim().length(15).optional(),
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().max(50).optional(),
  personal_phone: Joi.string().trim().optional(),
  office_phone: Joi.string().trim().required(),
  logo: Joi.string(),
  price_per_caret: Joi.number().min(0).required(),
  party_addresses: Joi.object({
    id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
    party_id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
    address: Joi.string().trim().required(),
    landmark: Joi.string().trim().optional(),
    pincode: Joi.string().trim().required().length(6),
  }).required(),
});

export const idSchema = Joi.object({
  id: Joi.number().required()
});