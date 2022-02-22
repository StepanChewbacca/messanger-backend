import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

dotenv.config();

export class ConfigService {
  static getCustomKey(key: string, throwOnMissing = true): string {
    const env = process.env[key];

    if (!env && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return env;
  }
  static getTypeOrmConfig(): ConnectionOptions {
    return {
      type: 'postgres',
      host: ConfigService.getCustomKey('DATABASE_HOST'),
      port: 5432,
      username: ConfigService.getCustomKey('DATABASE_USERNAME'),
      password: ConfigService.getCustomKey('DATABASE_PASSWORD'),
      database: ConfigService.getCustomKey('DATABASE_NAME'),
      entities: ['src/entity/*.ts'],
      logging: false,
      synchronize: true,
    };
  }
}
