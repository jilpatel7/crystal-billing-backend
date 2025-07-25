import Joi from 'joi';
import { start } from 'repl';

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

export const staffAttendanceSchema = Joi.object({
  id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  staff_id: Joi.number().required(),
  attendance_date: Joi.date().required(),
  status: Joi.string().valid('present', 'absent', 'half-day').required(),
  reason: Joi.string().allow('').optional(),
});

export const staffAttendanceSchemaForLeaveRequest = Joi.object({
  id: Joi.number().when('$isUpdate', { is: true, then: Joi.required(), otherwise: Joi.optional() }),
  staff_id: Joi.number().required(),
  status: Joi.string().valid('absent', 'half-day').required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  reason: Joi.string().allow('').optional(),
});
