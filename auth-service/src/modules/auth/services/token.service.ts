import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { AuthConfig } from '../../../config/services/auth.config.js';
import { User } from '../../users/entities/user.entity.js';
import { UserRole } from '../../../shared/auth/user-role.enum.js';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface SignedAccessToken {
  token: string;
  expiresIn: number;
}

export interface GeneratedRefreshToken {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

const REFRESH_TOKEN_BYTES = 48;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authConfig: AuthConfig,
  ) {}

  async signAccessToken(user: User): Promise<SignedAccessToken> {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    const { iat, exp } = this.jwtService.decode<{ iat: number; exp: number }>(
      token,
    );
    return { token, expiresIn: exp - iat };
  }

  generateRefreshToken(): GeneratedRefreshToken {
    const token = randomBytes(REFRESH_TOKEN_BYTES).toString('base64url');
    const ttl = this.authConfig.refreshTokenTtlDays * MS_PER_DAY;
    return {
      token,
      tokenHash: this.hashRefreshToken(token),
      expiresAt: new Date(Date.now() + ttl),
    };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
