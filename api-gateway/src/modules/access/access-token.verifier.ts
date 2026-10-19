import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthenticatedUser } from '../../shared/auth/authenticated-user.js';
import { UserRole } from '../../shared/auth/user-role.enum.js';
import {
  InvalidTokenException,
  TokenExpiredException,
} from './exceptions/index.js';

interface AccessTokenPayload {
  sub?: unknown;
  email?: unknown;
  role?: unknown;
}

const ROLES = new Set<string>(Object.values(UserRole));

@Injectable()
export class AccessTokenVerifier {
  constructor(private readonly jwtService: JwtService) {}

  async verify(token: string): Promise<AuthenticatedUser> {
    let payload: AccessTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        algorithms: ['HS256'],
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) throw new TokenExpiredException();
      throw new InvalidTokenException();
    }

    const { sub, email, role } = payload;
    if (
      typeof sub !== 'string' ||
      typeof email !== 'string' ||
      typeof role !== 'string' ||
      !ROLES.has(role)
    ) {
      throw new InvalidTokenException();
    }

    return { id: sub, email, role: role as UserRole };
  }
}
