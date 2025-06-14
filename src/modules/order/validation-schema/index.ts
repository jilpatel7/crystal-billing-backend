import Joi from "joi";

export const orderDetailsSchema = Joi.object({
  id: Joi.number().optional(),
  order_id: Joi.number().integer().optional(),
  no_of_diamonds: Joi.number().integer().min(1).required(),
  total_caret: Joi.number().positive().required(),
  price_per_caret: Joi.number().positive().required(),
  status: Joi.string().optional(),
});

export const orderSchema = Joi.object({
  id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  status: Joi.string().optional(),
  party_id: Joi.number().integer().min(1).required(),
  delivered_at: Joi.date().allow(null).optional(),
  delivered_by: Joi.number().allow(null).optional(),
  jagad_no: Joi.string(),
  received_at: Joi.date().required(),
  order_details: Joi.array().items(orderDetailsSchema).min(1).required(),
  removed_lot_ids: Joi.array().items(Joi.number()).optional(),
});