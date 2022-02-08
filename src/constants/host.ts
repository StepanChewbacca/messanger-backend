import dotenv from 'dotenv';

dotenv.config();

const {
  HOST_FOR_ROUTES,
} = process.env;

export const hosts = {
  HOST: `${HOST_FOR_ROUTES}`,
  HTTP: 'http://',
  HTTPS: 'https://',
};
