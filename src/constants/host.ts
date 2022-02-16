import { ConfigService } from '../config/config';

export const hosts = {
  HOST: `${ConfigService.getCustomKey('DOMAIN_BACKEND')}`,
  HTTP: 'http://',
  HTTPS: 'https://',
};
