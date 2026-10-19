import { UnauthorizedException } from '@nestjs/common';

export class MissingTokenException extends UnauthorizedException {
  constructor() {
    super({
      error: 'MISSING_TOKEN',
      message:
        'An access token is required. Send it as "Authorization: Bearer <token>".',
    });
  }
}
