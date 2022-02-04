import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';

export const checkValidToken = async (token: string): Promise<boolean> => {
  console.log(token);
  const validToken = decodeToken(token);

  console.log(validToken);

  if (!validToken) return false;
  const user = await userRepository.getUserById(validToken);

  if (!user) return false;

  return !!user.id;
};

export const getUserIdFromToken = async (token: string): Promise<string> => {
  const decodedToken = decodeToken(token);

  console.log(typeof decodedToken);

  if (!decodedToken) return null;

  return decodedToken;
};
