import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      extraProviders: [DatabaseConfig],
      inject: [DatabaseConfig],
      useFactory: (db: DatabaseConfig) => ({
        type: 'postgres',
        host: db.host,
        port: db.port,
        username: db.username,
        password: db.password,
        database: db.database,
        autoLoadEntities: true,
        synchronize: false,
        migrations: [`${import.meta.dirname}/migrations/*.js`],
        migrationsRun: true,
        logging: db.logging,
      }),
    }),
  ],
})
export class DatabaseModule {}
