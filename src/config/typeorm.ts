import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config = {
  // name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  // seeds: [MainSeeder],
  // factories: [UsersFactory],
  autoLoadEntities: true,
  synchronize: false,
  loggin: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
