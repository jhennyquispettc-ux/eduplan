import { UnauthorizedException } from '@nestjs/common';
import { RequestUser } from './request-user.js';

export function requireUserId(user: RequestUser): string {
  if (!user.id) {
    throw new UnauthorizedException({
      error: 'MISSING_USER_IDENTITY',
      message: 'The request does not identify an authenticated user.',
    });
  }
  return user.id;
}
