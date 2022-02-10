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
            "type": "postgres",
            "host": "host.docker.internal",
            "port": 5432,
            "username": "postgres",
            "password": "12345678",
            "database": "postgres",
            "entities": ["src/entity/*.ts"],
            "logging": true,
            "synchronize": true
        }
    }
}


