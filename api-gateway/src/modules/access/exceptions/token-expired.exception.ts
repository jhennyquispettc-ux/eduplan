import { UnauthorizedException } from '@nestjs/common';

export class TokenExpiredException extends UnauthorizedException {
  constructor() {
    super({
      error: 'TOKEN_EXPIRED',
      message:
        'The access token has expired. Use /auth/refresh to get a new one.',
    });
  }
}
