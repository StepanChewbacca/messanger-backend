import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET_KEY } = process.env;

export const generateToken = (data: any) => {
  const token = jwt.sign(data.id, JWT_SECRET_KEY);

  return token;
};

export const decodeToken = ({ token }: any) => {
  try {
    const result = jwt.verify(token, JWT_SECRET_KEY);

    return { result };
  } catch (error) {
    return { error };
  }
};
