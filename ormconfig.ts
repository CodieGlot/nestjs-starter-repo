import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { SnakeNamingStrategy } from './src/snake-naming.strategy';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const options: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: Boolean(process.env.ENABLE_SYNCHRONIZE),
    namingStrategy: new SnakeNamingStrategy(),
    entities: ['src/modules/**/*.entity{.ts,.js}'],
    migrations: ['src/database/migrations/*{.ts,.js}']
};

export const dataSource = new DataSource(options);
