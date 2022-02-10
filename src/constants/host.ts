import { ConfigService } from './../config/config';

export const hosts = {
  HOST: `${ConfigService.getCustomKey('HOST_FOR_ROUTES')}`,
  HTTP: 'http://',
  HTTPS: 'https://',
};
