import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { UpstreamHealthIndicator } from './upstream-health.indicator.js';
import { Upstream } from '../../modules/routing/upstream.enum.js';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly upstreams: UpstreamHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.upstreams.check(Upstream.AUTH),
      () => this.upstreams.check(Upstream.COURSES),
    ]);
  }
}
