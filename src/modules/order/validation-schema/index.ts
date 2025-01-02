import Joi from "joi";

const orderDetailsSchema = Joi.object({
  no_of_diamonds: Joi.number().integer().min(1).required(),
  total_caret: Joi.number().positive().required(),
  price_per_caret: Joi.number().positive().required(),
});

export const orderSchema = Joi.object({
  id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  party_id: Joi.number().integer().min(1).required(),
  no_of_lots: Joi.number().integer().min(1).required(),
  delivered_at: Joi.date().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  delivered_by: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  jagad_no: Joi.string(),
  received_at: Joi.date().required(),
  order_details: Joi.array().items(orderDetailsSchema).min(1).required(),
});