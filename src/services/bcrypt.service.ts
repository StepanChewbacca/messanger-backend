import bcrypt from 'bcrypt';
import { ConfigService } from '../config/config';
import { IServiceResult } from '../interface/error';

export const hash = (password: string): Promise<string> => bcrypt.hash(password, +ConfigService.getCustomKey('SALT_BCRYPT'));

export const compare = async (password: string, hashPassword: string): Promise<IServiceResult<string, Error >> => {
  try {
    const result = bcrypt.compare(password, hashPassword);

    return { result };
  } catch (error) {
    console.error(error);

    return { error };
  }
};
