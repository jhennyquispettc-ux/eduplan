import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { GatewayConfig } from '../../config/services/gateway.config.js';
import { AppConfig } from '../../config/services/app.config.js';
import { Upstream } from '../../modules/routing/upstream.enum.js';

const HEALTH_TIMEOUT_MS = 2000;

@Injectable()
export class UpstreamHealthIndicator {
  constructor(
    private readonly healthIndicator: HealthIndicatorService,
    private readonly gatewayConfig: GatewayConfig,
    private readonly appConfig: AppConfig,
  ) {}

  async check(upstream: Upstream) {
    const indicator = this.healthIndicator.check(upstream);
    const url = `${this.gatewayConfig.upstreams[upstream]}/${this.appConfig.apiPrefix}/health`;

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
      });
      return response.ok
        ? indicator.up()
        : indicator.down({ httpStatus: response.status });
    } catch (error) {
      return indicator.down({ reason: (error as Error).message });
    }
  }
}
