import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { GatewayConfig } from '../../config/services/gateway.config.js';
import { AccessTokenVerifier } from './access-token.verifier.js';
import { AccessGuard } from './access.guard.js';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [GatewayConfig],
      useFactory: (config: GatewayConfig) => ({
        secret: config.jwtAccessSecret,
        verifyOptions: { algorithms: ['HS256'] },
      }),
    }),
  ],
  providers: [
    AccessTokenVerifier,
    { provide: APP_GUARD, useClass: AccessGuard },
  ],
})
export class AccessModule {}
