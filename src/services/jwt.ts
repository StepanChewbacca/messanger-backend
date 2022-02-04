import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../interface/userInterfaces';

dotenv.config();
const { JWT_SECRET_KEY } = process.env;

export const generateToken = (id: IUser['id']): number => jwt.sign(id, JWT_SECRET_KEY);

export const decodeToken = (token: string | string[]): string => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    console.error(error);

    return null;
  }
};
