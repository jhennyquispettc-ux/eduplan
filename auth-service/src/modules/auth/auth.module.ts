import { Module } from '@nestjs/common';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository.js';
import { TokenService } from './services/token.service.js';
import { AuthService } from './services/auth.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { UsersModule } from '../users/users.module.js';
import { AuthConfig } from '../../config/services/auth.config.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      inject: [AuthConfig],
      useFactory: (config: AuthConfig) => ({
        secret: config.accessSecret,
        signOptions: {
          algorithm: 'HS256',
          expiresIn: config.accessExpiresIn as JwtSignOptions['expiresIn'],
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [RefreshTokensRepository, TokenService, AuthService],
})
export class AuthModule {}
