import 'dotenv/config';
import { join } from 'node:path';
import { DataSource } from 'typeorm';

const sourceRoot = join(import.meta.dirname, '..', '..');
const extension = import.meta.filename.endsWith('.ts') ? 'ts' : 'js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(sourceRoot, `**/*.entity.${extension}`)],
  migrations: [join(sourceRoot, `database/migrations/*.${extension}`)],
  synchronize: false,
  logging: false,
});
