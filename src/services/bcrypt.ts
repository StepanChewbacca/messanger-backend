import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const { SALT_BCRYPT } = process.env;

export const hash = (password: string): Promise<string> => bcrypt.hash(password, +SALT_BCRYPT);

export const compare = async (password: string, hashPassword: string): Promise<boolean> => bcrypt.compare(password, hashPassword);
