import { decodeToken } from './jwt';
import { user } from '../repository/user.repository';

export const checkValidToken = async (value) => {
  const { result, error } = decodeToken(value);

  if (error) return false;
  const { DBResult, DBError } = await user.getUserByEmail(result);

  if (DBError) return false;

  return !!DBResult;
};

export const getUserIdFromToken = async (headers) => {
  const { result, error } = decodeToken(headers);

  if (error) return { TokenError: { data: error.message, status: 400 } };

  return { result };
};
