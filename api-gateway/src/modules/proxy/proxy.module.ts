import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service.js';
import { ProxyController } from './proxy.controller.js';

@Module({
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
