import { NextFunction, Request, Response } from 'express';
import {
  additionalInfoValidation, emailValidation, passwordValidation,
  queryTokenValidation, signValidation,
} from '../middlewares/validation/user.validator';
import { userRepository } from '../repository/user.repository';
import { checkValidToken, getUserEmailFromToken } from '../services/checkToken';
import { userServices } from '../services/user.services/user.service';

const { JWT_SIGN_UP_KEY, JWT_SIGN_IN_KEY, JWT_FORGOT_PASSWORD_KEY } = process.env;

class UserController {
  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value, error } = signValidation.validate(req.body, { abortEarly: false });

    if (error) {
      return next({ data: error.details[0].message, status: 400 });
    }

    const { result, error: servicesError } = await userServices.createUser(value);

    if (servicesError) return next({ data: 'Email was not sent', status: 500 });

    res.status(200).send(result);
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: 400 });

    const isValidToken = await checkValidToken(value.token, JWT_SIGN_UP_KEY);

    console.log(isValidToken);

    if (isValidToken) {
      res.setHeader('token', value.token);
      res.redirect('http://sluipgenius.pp.ua/getImage/7');
    } else {
      res.redirect('https://www.google.com');
    }
  };

  addInfoUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value, error } = additionalInfoValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error, status: 400 });

    const userEmail = await getUserEmailFromToken(req.headers.token as string, JWT_SIGN_UP_KEY);

    if (!userEmail) return next({ data: 'Invalid token', status: 400 });

    const user = await userRepository.addInfoUser(value, userEmail);

    if (!user) return next({ data: 'Internal Error', status: 500 });

    res.status(200).send(user);
  };

  signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value, error } = signValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error, status: 400 });

    const token = await userServices.signIn(value);

    if (!token) return next({ data: 'Internal Error', status: 500 });

    res.status(200).send(token);
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value, error } = emailValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: 'Invalid email', status: 400 });

    const token = await userServices.forgotPassword(value);

    if (!token) return next({ data: 'Internal Error', status: 500 });

    res.status(200).send(token);
  };

  confirmChangePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: 400 });

    const isValidToken = await checkValidToken(value.token, JWT_FORGOT_PASSWORD_KEY);

    // const confirmToken = generateConfirmToken(value.email)

    console.log(isValidToken);

    if (isValidToken) {
      res.setHeader('token', value.token);
      res.redirect('http://sluipgenius.pp.ua/getImage/7');
    } else {
      res.redirect('https://www.google.com');
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { value, error } = passwordValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error, status: 400 });

    const { result, error: changePasswordError } = await userServices.changePassword(value, req.headers.token);

    if (changePasswordError) return next({ data: 'Invalid token', status: 400 });

    res.status(200).send(result);
  };
}

export const userController = new UserController();
