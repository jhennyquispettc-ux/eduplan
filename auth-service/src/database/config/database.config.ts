import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/services/app.config.js';

@Injectable()
export class DatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
  readonly logging: boolean;

  constructor(config: ConfigService, app: AppConfig) {
    this.host = config.getOrThrow<string>('DB_HOST');
    this.port = config.getOrThrow<number>('DB_PORT');
    this.username = config.getOrThrow<string>('DB_USER');
    this.password = config.getOrThrow<string>('DB_PASSWORD');
    this.database = config.getOrThrow<string>('DB_NAME');
    this.logging = app.isProduction
      ? false
      : config.get<boolean>('DB_LOGS', false);
  }
}
