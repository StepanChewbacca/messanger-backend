import { constants as httpConstants } from 'http2';
import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';
import { IUser } from '../interface/userInterfaces';
import { IServiceResult } from '../interface/error';

export const checkValidToken = async (token: string, JWT_SECRET_KEY: string): Promise<boolean> => {
  const { result } = decodeToken<IUser>(token, JWT_SECRET_KEY);

  if (!result) return false;

  const { user } = await userRepository.getUserByEmail(result.email);

  if (!user) return false;

  return !!user.id;
};

export const getUserEmailFromToken = async (token: string, JWT_SECRET_KEY: string): Promise<IServiceResult<IUser, Error>> => {
  const decodedToken = decodeToken<IUser>(token, JWT_SECRET_KEY);

  if (!decodedToken) return null;

  return decodedToken;
};
