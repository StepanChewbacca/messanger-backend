import Joi from 'joi';

export const messageValidation = Joi.object().keys({
  text: Joi.string().min(1).required(),
  read: Joi.boolean().required(),
  send_date: Joi.date().required(),
  chat_id: Joi.number().min(1).required(),
});

export const chatIdValidation = Joi.object().keys({
  page: Joi.number().min(1).required(),
  perPage: Joi.number().min(1).required(),
  chat_id: Joi.number().min(1).required(),
});
