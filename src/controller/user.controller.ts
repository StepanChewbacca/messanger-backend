import { NextFunction, Request, Response } from 'express';
import {
  additionalInfoValidation,
  queryTokenValidation,
  signUpValidation,
} from '../middlewares/validation/user.validator';
import { user } from '../repository/user.repository';
import { generateToken } from '../services/jwt';
import { sendMMail } from '../services/sendMail';
import { checkValidToken, getUserIdFromToken } from '../services/checkToken';

class UserController {
  constructor() {}

  async createUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { value, error } = signUpValidation.validate(req.body, { abortEarly: false });

    if (error) {
      return next({ data: error.details[0].message, status: 400 });
    }

    const { DBResult, DBError } = await user.createUser(value);

    if (DBError) return next({ data: DBError.data, status: 400 });

    const token = generateToken(DBResult.data);
    const { MailerResult, MailerError } = await sendMMail(DBResult.data, token);

    if (MailerError) return next({ data: MailerError.data, status: MailerError.status });

    res.status(MailerResult.status).send(MailerResult);
  }

  async confirmEmail(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: 400 });

    if (await checkValidToken(value)) {
      res.setHeader('token', value.token);
      res.redirect('http://sluipgenius.pp.ua/getImage/7');
    } else {
      res.redirect('https://www.google.com');
    }
  }

  async addInfoUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    const { value, error } = additionalInfoValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error, status: 400 });

    const { result, TokenError } = await getUserIdFromToken(req.headers);

    if (TokenError) return next({ data: TokenError.data, status: 500 });

    const { DBResult, DBError } = await user.addInfoUser(value, result);

    if (DBError) return next({ data: DBError.data, status: 500 });

    res.status(DBResult.status).send(DBResult);
  }
}

export const userController = new UserController();
