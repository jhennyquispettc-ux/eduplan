import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfig {
  readonly accessSecret: string;
  readonly accessExpiresIn: string;
  readonly refreshTokenTtlDays: number;
  readonly bcryptRounds: number;

  constructor(config: ConfigService) {
    this.accessSecret = config.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.accessExpiresIn = config.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN');
    this.refreshTokenTtlDays = config.getOrThrow<number>(
      'REFRESH_TOKEN_TTL_DAYS',
    );
    this.bcryptRounds = config.getOrThrow<number>('BCRYPT_ROUNDS');
  }
}
