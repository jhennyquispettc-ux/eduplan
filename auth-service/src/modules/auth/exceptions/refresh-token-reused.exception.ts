import { UnauthorizedException } from '@nestjs/common';

export class RefreshTokenReusedException extends UnauthorizedException {
  constructor() {
    super({
      error: 'REFRESH_TOKEN_REUSED',
      message:
        'This refresh token was already used. All sessions have been closed for safety.',
    });
  }
}
