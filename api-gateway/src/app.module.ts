import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from './config/config.module.js';
import { RoutingModule } from './modules/routing/routing.module.js';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module.js';
import { AccessModule } from './modules/access/access.module.js';
import { HealthModule } from './app/health/health.module.js';
import { ProxyModule } from './modules/proxy/proxy.module.js';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware.js';
import { RouteResolutionMiddleware } from './common/middleware/route-resolution.middleware.js';

@Module({
  imports: [
    AppConfigModule,
    RoutingModule,
    RateLimitModule,
    AccessModule,
    HealthModule,
    ProxyModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        RequestIdMiddleware,
        RequestLoggerMiddleware,
        RouteResolutionMiddleware,
      )
      .forRoutes('*path');
  }
}
