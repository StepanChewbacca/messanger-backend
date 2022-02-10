import dotenv from 'dotenv';
import fs from "fs";
import { createConnection } from 'typeorm';

dotenv.config();

export class ConfigService {
    static getCustomKey(key: string, throwOnMissing = true): string {
        const env = process.env[key];
        if (!env && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return env;
    }
    static getTypeOrmConfig() {
        return {
            "type": ConfigService.getCustomKey('DATABASE_TYPE'),
            "host": ConfigService.getCustomKey('DATABASE_HOST'),
            "port": ConfigService.getCustomKey('DATABASE_PORT'),
            "username": ConfigService.getCustomKey('DATABASE_USERNAME'),
            "password": ConfigService.getCustomKey('DATABASE_PASSWORD'),
            "database": ConfigService.getCustomKey('DATABASE_NAME'),
            "entities": ["src/entity/*.ts"],
            "logging": true,
            "synchronize": true
        }
    }
}


