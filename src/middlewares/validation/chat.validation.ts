import Joi from 'joi';
import { UserGenderEnum } from '../../enums/user.enums';

export const userIdChatIdValidation = Joi.object().keys({
  user_id: Joi.number().min(1).required(),
  chat_id: Joi.number().min(1).required(),
});

export const chatNameValidation = Joi.object().keys({
  name: Joi.string().min(1).required(),
});
