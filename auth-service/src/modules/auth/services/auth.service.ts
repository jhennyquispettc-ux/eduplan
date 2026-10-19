import { Injectable } from '@nestjs/common';
import { TokenService } from './token.service.js';
import { RefreshTokensRepository } from '../repositories/refresh-tokens.repository.js';
import { RegisterDto } from '../dto/register.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { AuthResponseDto } from '../dto/auth-response.dto.js';
import {
  AccountInactiveException,
  AccountPendingApprovalException,
  InvalidCredentialsException,
  InvalidRefreshTokenException,
  RefreshTokenReusedException,
} from '../exceptions/index.js';
import { UsersService } from '../../users/services/users.service.js';
import { User } from '../../users/entities/user.entity.js';
import { UserDto } from '../../users/dto/user.dto.js';
import { UserStatus } from '../../users/enums/user-status.enum.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
  ) {}

  register(dto: RegisterDto): Promise<UserDto> {
    return this.usersService.registerStudent(dto);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByCredentials(
      dto.email,
      dto.password,
    );
    if (!user) throw new InvalidCredentialsException();
    this.assertCanSignIn(user);

    const refresh = this.tokenService.generateRefreshToken();
    await this.refreshTokensRepository.create({
      userId: user.id,
      tokenHash: refresh.tokenHash,
      expiresAt: refresh.expiresAt,
    });
    await this.usersService.recordLogin(user.id);

    return this.buildResponse(user, refresh.token);
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    const tokenHash = this.tokenService.hashRefreshToken(refreshToken);
    const current = await this.refreshTokensRepository.findByHash(tokenHash);

    if (!current) throw new InvalidRefreshTokenException();
    if (current.replacedById) {
      await this.refreshTokensRepository.revokeAllForUser(current.userId);
      throw new RefreshTokenReusedException();
    }
    if (current.revokedAt || current.expiresAt <= new Date()) {
      throw new InvalidRefreshTokenException();
    }

    const user = await this.usersService.findEntityOrNull(current.userId);
    if (!user) {
      await this.refreshTokensRepository.revokeAllForUser(current.userId);
      throw new InvalidRefreshTokenException();
    }
    if (user.status !== UserStatus.ACTIVE) {
      await this.refreshTokensRepository.revokeAllForUser(user.id);
      this.assertCanSignIn(user);
    }

    const next = this.tokenService.generateRefreshToken();
    const rotated = await this.refreshTokensRepository.rotate(current.id, {
      userId: user.id,
      tokenHash: next.tokenHash,
      expiresAt: next.expiresAt,
    });
    if (!rotated) {
      await this.refreshTokensRepository.revokeAllForUser(user.id);
      throw new RefreshTokenReusedException();
    }

    return this.buildResponse(user, next.token);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.tokenService.hashRefreshToken(refreshToken);
    const current = await this.refreshTokensRepository.findByHash(tokenHash);
    if (current) await this.refreshTokensRepository.revoke(current.id);
  }

  private assertCanSignIn(user: User): void {
    if (user.status === UserStatus.PENDING) {
      throw new AccountPendingApprovalException();
    }
    if (user.status === UserStatus.INACTIVE) {
      throw new AccountInactiveException();
    }
  }

  private async buildResponse(
    user: User,
    refreshToken: string,
  ): Promise<AuthResponseDto> {
    const access = await this.tokenService.signAccessToken(user);
    return {
      accessToken: access.token,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: access.expiresIn,
      user: UserDto.fromEntity(user),
    };
  }
}
