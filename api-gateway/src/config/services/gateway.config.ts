import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Upstream } from '../../modules/routing/upstream.enum.js';

@Injectable()
export class GatewayConfig {
  readonly jwtAccessSecret: string;
  readonly upstreams: Record<Upstream, string>;
  readonly proxyTimeoutMs: number;
  readonly throttleTtlMs: number;
  readonly throttleLimit: number;
  readonly throttleAuthLimit: number;

  constructor(config: ConfigService) {
    this.jwtAccessSecret = config.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.upstreams = {
      [Upstream.AUTH]: this.origin(config, 'AUTH_SERVICE_URL'),
      [Upstream.COURSES]: this.origin(config, 'COURSES_SERVICE_URL'),
    };
    this.proxyTimeoutMs = config.getOrThrow<number>('PROXY_TIMEOUT_MS');
    this.throttleTtlMs = config.getOrThrow<number>('THROTTLE_TTL_MS');
    this.throttleLimit = config.getOrThrow<number>('THROTTLE_LIMIT');
    this.throttleAuthLimit = config.getOrThrow<number>('THROTTLE_AUTH_LIMIT');
  }

  private origin(config: ConfigService, key: string): string {
    return config.getOrThrow<string>(key).replace(/\/$/, '');
  }
}
