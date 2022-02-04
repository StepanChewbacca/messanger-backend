import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const { SALT_BCRYPT } = process.env;

export const hash = async (password: string) => {
  const pass = await bcrypt.hash(password, +SALT_BCRYPT);

  return pass;
};

export const compare = async (password: string, hashPassword: string) => {
  await bcrypt.compare(password, hashPassword);
};
