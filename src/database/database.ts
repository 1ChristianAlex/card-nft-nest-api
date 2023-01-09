import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join, resolve } from 'path';

const envPath = resolve(join(__dirname, '..', '..', '.env'));

dotenv.config({ path: envPath });

const ormDatabaseContext = {
  type: 'postgres',
  host: process.env.DB_URL,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['./src/database/migrations/**'],
  migrationsTableName: 'custom_migration_table',
};

const datasource = new DataSource(ormDatabaseContext as DataSourceOptions);

export { ormDatabaseContext };
export default datasource;

// npx typeorm-ts-node-commonjs migration:create ./src/database/migrations/initial-schema
// npx typeorm-ts-node-commonjs migration:generate ./src/database/migrations/migration --dataSource ./src/database/database
// npx typeorm-ts-node-commonjs migration:run --dataSource ./src/database/database
