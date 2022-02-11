import { NextFunction, Request, Response } from 'express';
import { constants as httpConstants } from 'http2';
import { ConfigService } from '../config/config';
import {
  additionalInfoValidation, emailValidation, passwordValidation,
  queryTokenValidation, signValidation,
} from '../middlewares/validation/user.validator';
import { checkValidToken } from '../services/checkToken';
import { userServices } from '../services/user.services/user.service';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = signValidation.validate(req.body, { abortEarly: false });

    if (error) {
      return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });
    }

    const { result, error: servicesError } = await userServices.createUser(value);

    if (servicesError) {
      return next({ data: servicesError.data, status: servicesError.status });
    }

    res.status(httpConstants.HTTP_STATUS_OK).send(result);
  }

  async confirmEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const isValidToken = await checkValidToken(value.token, ConfigService.getCustomKey('JWT_SIGN_UP_KEY'));

    if (isValidToken) {
      res.setHeader('token', value.token);
      res.redirect('http://127.0.0.1:3006/api/user/accept-invitation');
    } else {
      res.redirect('http://127.0.0.1:3006/api/user/error');
    }
  }

  async addInfoUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = additionalInfoValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    const { result, error: serviceError } = await userServices.addInfoUser(value, req.headers.token as string);

    if (serviceError) return next({ data: 'Invalid token', status: httpConstants.HTTP_STATUS_BAD_REQUEST });

    res.status(httpConstants.HTTP_STATUS_OK).send(result);
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

    const isValidToken = await checkValidToken(value.token, ConfigService.getCustomKey('JWT_FORGOT_PASSWORD_KEY'));

    if (isValidToken) {
      res.setHeader('token', value.token);
      res.redirect('http://www.stepanchewbacca.pp.ua/api/user/change-password');
    } else {
      res.redirect('http://www.stepanchewbacca.pp.ua/api/user/error');
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
