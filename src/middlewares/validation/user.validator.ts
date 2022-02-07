import Joi from 'joi';
import { regex } from '../../constants/regex';

export const signValidation = Joi.object().keys({
  email: Joi.string().min(5).regex(regex.EMAIL).required(),
  password: Joi.string().min(2).required(),
});

export const queryTokenValidation = Joi.object().keys({
  token: Joi.string().min(2).required(),
});

export const additionalInfoValidation = Joi.object().keys({
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  date_of_birthday: Joi.date().required(),
  gender: Joi.string().min(2).required(),
});

export const emailValidation = Joi.object().keys({
  email: Joi.string().min(5).regex(regex.EMAIL).required(),
});

export const passwordValidation = Joi.object().keys({
  password: Joi.string().min(2).required(),
});
