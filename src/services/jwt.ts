import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../interface/userInterfaces';

dotenv.config();
const {
  JWT_SIGN_UP_KEY, JWT_SIGN_IN_KEY, JWT_FORGOT_PASSWORD_KEY, JWT_CONFIRM_KEY,
} = process.env;

export const generateSignUpToken = (email: IUser['email']): string => jwt.sign(email, JWT_SIGN_UP_KEY);

export const generateSignInToken = (email: IUser['email']): string => jwt.sign(email, JWT_SIGN_IN_KEY);

export const generateForgotPasswordToken = (email: IUser['email']): string => jwt.sign(email, JWT_FORGOT_PASSWORD_KEY);

export const generateConfirmToken = (id: IUser['email']): string => jwt.sign(id, JWT_CONFIRM_KEY);

export const decodeToken = (token: string, JWT_SECRET_KEY: string): string => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (error) {
    console.error(error);

    return null;
  }
};
