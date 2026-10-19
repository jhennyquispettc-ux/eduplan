import { UnauthorizedException } from '@nestjs/common';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      error: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
    });
  }
}
