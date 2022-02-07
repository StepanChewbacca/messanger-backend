import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';

//const { JWT_SIGN_UP_KEY, JWT_SIGN_IN_KEY, JWT_FORGOT_PASSWORD_KEY } = process.env;

export const checkValidToken = async (token: string, JWT_SECRET_KEY: string): Promise<boolean> => {
  console.log(token);
  const decodedToken = decodeToken(token, JWT_SECRET_KEY);

  console.log(decodedToken);

  if (!decodedToken) return false;
  const user = await userRepository.getUserByEmail(decodedToken);

  if (!user) return false;

  return !!user.id;
};

export const getUserEmailFromToken = async (token: string, JWT_SECRET_KEY: string): Promise<string> => {
  const decodedToken = decodeToken(token, JWT_SECRET_KEY);

  if (!decodedToken) return null;

  return decodedToken;
};
