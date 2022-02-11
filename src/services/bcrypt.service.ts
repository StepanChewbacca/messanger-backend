import bcrypt from 'bcrypt';
import { ConfigService } from '../config/config';

export const hash = (password: string): Promise<string> => bcrypt.hash(password, +ConfigService.getCustomKey('SALT_BCRYPT'));

export const compare = async (password: string, hashPassword: string): Promise<boolean> => bcrypt.compare(password, hashPassword);
