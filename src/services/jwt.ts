import jwt from 'jsonwebtoken';
import { IUser } from '../interface/user.interfaces';
import { IServiceResult } from '../interface/returns.interface';
import { sendErrorToTelegram } from './telegramAPI.service';

export const generateToken = (email: IUser['email'], JWT_SECRET_KEY: string): string => jwt.sign({ email }, JWT_SECRET_KEY);

export const decodeToken = <TResult>(token: string, JWT_SECRET_KEY: string): IServiceResult<TResult, Error> => {
  try {
    const result = jwt.verify(token, JWT_SECRET_KEY);

    return { result };
  } catch (error) {
    sendErrorToTelegram(error).then(() => console.error(error));

    return null;
  }
};
