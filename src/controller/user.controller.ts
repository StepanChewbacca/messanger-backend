import { NextFunction, Request, Response } from 'express';
import { constants as httpConstants } from 'http2';
import {
  additionalInfoValidation, emailValidation, passwordValidation,
  queryTokenValidation, signValidation,
} from '../middlewares/validation/user.validator';
import { userRepository } from '../repository/user.repository';
import { checkValidToken, getUserEmailFromToken } from '../services/checkToken';
import { userServices } from '../services/user.services/user.service';

const { JWT_SIGN_UP_KEY, JWT_FORGOT_PASSWORD_KEY } = process.env;

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = signValidation.validate(req.body, { abortEarly: false });

    if (error) {
      return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });
    }

    const { result, error: servicesError } = await userServices.createUser(value);

    if (servicesError) {
      return next({
        data: servicesError.data,
        status: servicesError.status,
      });
    }

    res.status(httpConstants.HTTP_STATUS_OK).send(result);
  }

  async confirmEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const isValidToken = await checkValidToken(value.token, JWT_SIGN_UP_KEY);

    if (isValidToken) {
      res.setHeader('token', value.token);
      res.redirect('http://www.stepanchewbacca.pp.ua/images/download/9');
    } else {
      res.redirect('https://www.google.com');
    }
  }

  async addInfoUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = additionalInfoValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const userEmail = await getUserEmailFromToken(req.headers.token as string, JWT_SIGN_UP_KEY);

    if (!userEmail) return next({ data: 'Invalid token', status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const user = await userRepository.addInfoUser(value, userEmail);

    if (!user) return next({ data: 'Internal Error', status: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR });

    res.status(httpConstants.HTTP_STATUS_OK).send(user);
  }

  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = signValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const { result, error: servicesError } = await userServices.signIn(value);

    if (servicesError) return next({ data: servicesError.data, status: servicesError.status });

    res.status(httpConstants.HTTP_STATUS_OK).send(result);
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = emailValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: 'Invalid email', status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const { result, error: serviceError } = await userServices.forgotPassword(value);

    if (serviceError) return next({ data: serviceError.data, status: serviceError.status });

    res.status(httpConstants.HTTP_STATUS_OK).send(result);
  }

  async confirmChangePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const isValidToken = await checkValidToken(value.token, JWT_FORGOT_PASSWORD_KEY);

    if (isValidToken) {
      res.setHeader('token', value.token);
      res.redirect('http://www.stepanchewbacca.pp.ua/images/download/9');
    } else {
      res.redirect('https://www.google.com');
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = passwordValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error, status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const { result, error: serviceError } = await userServices.changePassword(value, req.headers.token as string);

    if (serviceError) return next({ data: serviceError.data, status: serviceError.status });

    res.status(httpConstants.HTTP_STATUS_OK).send(result);
  }
}

export const userController = new UserController();
