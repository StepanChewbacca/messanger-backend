import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';

export const checkValidToken = async (token: string, JWT_SECRET_KEY: string): Promise<boolean> => {
  const decodedToken = decodeToken(token, JWT_SECRET_KEY);

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
