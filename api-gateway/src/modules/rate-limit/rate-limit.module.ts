import { ExecutionContext, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { Request } from 'express';
import { GatewayConfig } from '../../config/services/gateway.config.js';
import { CREDENTIALS_THROTTLER, GLOBAL_THROTTLER } from './throttler-names.js';

const isCredentialsRoute = (context: ExecutionContext): boolean =>
  context.switchToHttp().getRequest<Request>().gatewayRoute?.credentials ===
  true;

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [GatewayConfig],
      useFactory: (config: GatewayConfig) => ({
        throttlers: [
          {
            name: GLOBAL_THROTTLER,
            ttl: config.throttleTtlMs,
            limit: config.throttleLimit,
          },
          {
            name: CREDENTIALS_THROTTLER,
            ttl: config.throttleTtlMs,
            limit: config.throttleAuthLimit,
            skipIf: (context) => !isCredentialsRoute(context),
          },
        ],
        errorMessage: 'Too many requests. Please wait before trying again.',
      }),
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class RateLimitModule {}
