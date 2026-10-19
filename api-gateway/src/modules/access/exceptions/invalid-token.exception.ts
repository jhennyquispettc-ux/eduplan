import { UnauthorizedException } from '@nestjs/common';

export class InvalidTokenException extends UnauthorizedException {
  constructor() {
    super({
      error: 'INVALID_TOKEN',
      message: 'The access token is invalid.',
    });
  }
}
