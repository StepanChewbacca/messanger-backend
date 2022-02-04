import { NextFunction, Request, Response } from 'express';
import {
  additionalInfoValidation,
  queryTokenValidation,
  signUpValidation,
} from '../middlewares/validation/user.validator';
import { userRepository } from '../repository/user.repository';
import { checkValidToken, getUserIdFromToken } from '../services/checkToken';
import { createUser } from '../services/user.services/createUser.service';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = signUpValidation.validate(req.body, { abortEarly: false });

    if (error) {
      return next({ data: error.details[0].message, status: 400 });
    }

    const { result, error: servicesError } = await createUser(value);

    if (servicesError) return next({ data: 'Email was not sent', status: 500 });

    res.status(200).send(result);
  }

  async confirmEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: 400 });

    const isValidToken = await checkValidToken(value.token);

    console.log(isValidToken);

    if (isValidToken) {
      res.setHeader('token', value.token);
      res.redirect('http://sluipgenius.pp.ua/getImage/7');
    } else {
      res.redirect('https://www.google.com');
    }
  }

  async addInfoUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = additionalInfoValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error, status: 400 });

    const userId = await getUserIdFromToken(req.headers.token as string);

    if (!userId) return next({ data: 'Invalid token', status: 400 });

    const user = await userRepository.addInfoUser(value, userId);

    if (!user) return next({ data: 'Internal Error', status: 500 });

    res.status(200).send(user);
  }
}

export const userController = new UserController();
