import Joi from 'joi';

export const partySchema = Joi.object({
  id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  gstin_no: Joi.string().trim().length(15).optional().allow(''),
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().max(50).optional(),
  personal_phone: Joi.string().trim().optional(),
  office_phone: Joi.string().trim().required(),
  logo: Joi.string(),
  party_addresses: Joi.array().items(Joi.object({ 
    id: Joi.number().optional().allow(null),
    party_id: Joi.number().optional(),
    address: Joi.string().trim().required(),
    landmark: Joi.string().trim().optional().allow(''),
    pincode: Joi.string().trim().required().length(6),
  })).required(),
  removed_address_ids: Joi.array().items(Joi.number()).optional(),
});

export const idSchema = Joi.object({
  id: Joi.number().required(),
});
