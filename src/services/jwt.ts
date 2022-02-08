import jwt from 'jsonwebtoken';
import { IUser } from '../interface/userInterfaces';

export const generateToken = (email: IUser['email'], JWT_SECRET_KEY: string): string => jwt.sign(email, JWT_SECRET_KEY);

export const decodeToken = (token: string, JWT_SECRET_KEY: string): string => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    console.error(error);

    return null;
  }
};
