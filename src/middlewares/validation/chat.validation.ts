import Joi from 'joi';

export const userIdChatIdValidation = Joi.object().keys({
  user_id: Joi.number().min(1).required(),
  chat_id: Joi.number().min(1).required(),
});

export const chatNameValidation = Joi.object().keys({
  name: Joi.string().min(1).required(),
});

export const getChatsValidation = Joi.object().keys({
  name: Joi.string().default(''),
  id: Joi.number().positive(),
  page: Joi.number().positive().default(1),
  perPage: Joi.number().positive().default(50),
});
