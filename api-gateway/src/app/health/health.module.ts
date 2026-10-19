import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller.js';
import { UpstreamHealthIndicator } from './upstream-health.indicator.js';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [UpstreamHealthIndicator],
})
export class HealthModule {}
