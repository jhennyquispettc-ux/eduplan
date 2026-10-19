import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentEnum } from '../../shared/enums/environment.enum.js';

@Injectable()
export class AppConfig {
  readonly nodeEnv: string;
  readonly port: number;
  readonly apiPrefix: string;
  readonly corsOrigins: string;
  readonly isProduction: boolean;

  constructor(config: ConfigService) {
    this.nodeEnv = config.getOrThrow<string>('NODE_ENV');
    this.port = config.getOrThrow<number>('PORT');
    this.apiPrefix = config.getOrThrow<string>('API_PREFIX');
    this.corsOrigins = config.getOrThrow<string>('CORS_ORIGINS');
    this.isProduction = this.nodeEnv === EnvironmentEnum.PRODUCTION;
  }
}
