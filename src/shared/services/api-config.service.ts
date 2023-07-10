import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
    constructor(private configService: ConfigService) {}

    private get(key: string): string {
        const value = this.configService.get<string>(key);

        if (!value) {
            throw new Error(key + ' environment variable does not set');
        }

        return value;
    }

    private getNumber(key: string): number {
        const value = this.get(key);

        try {
            return Number(value);
        } catch {
            throw new Error(key + ' environment variable is not a number');
        }
    }

    private getBoolean(key: string): boolean {
        const value = this.get(key);

        try {
            return Boolean(JSON.parse(value));
        } catch {
            throw new Error(key + ' env var is not a boolean');
        }
    }

    private getString(key: string): string {
        const value = this.get(key);

        return value.replace(/\\n/g, '\n');
    }

    get nodeEnv(): string {
        return this.getString('NODE_ENV');
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    get isTest(): boolean {
        return this.nodeEnv === 'test';
    }

    get documentationEnabled(): boolean {
        return this.getBoolean('ENABLE_DOCUMENTATION');
    }

    get serverConfig() {
        return {
            port: this.getNumber('PORT') || 4000
        };
    }

    get postgresConfig(): TypeOrmModuleOptions {
        let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
        let migrations = [__dirname + '/../../databases/migrations/*{.ts,.js}'];

        return {
            entities,
            migrations,
            keepConnectionAlive: !this.isTest,
            type: 'postgres',
            name: 'default',
            host: this.getString('DB_HOST'),
            port: this.getNumber('DB_PORT') || 5432,
            username: this.getString('DB_USERNAME'),
            password: this.getString('DB_PASSWORD'),
            database: this.getString('DB_DATABASE'),
            synchronize: this.isDevelopment ? true : false,
            //migrationsRun: true,
            logging: this.getBoolean('ENABLE_ORM_LOGS'),
            namingStrategy: new SnakeNamingStrategy()
        };
    }

    get authConfig() {
        return {
            jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME') || 3600,
            jwtRefreshExpirationTime: this.getNumber('JWT_REFRESH_EXPIRATON_TIME') || 604800,
            privateKey: this.getString('JWT_PRIVATE_KEY'),
            publicKey: this.getString('JWT_PUBLIC_KEY')
        };
    }

    get throttlerConfig() {
        return {
            ttl: this.getNumber('THROTTLE_TTL') || 60,
            limit: this.getNumber('THROTTLE_LIMIT') || 10
        };
    }
}
