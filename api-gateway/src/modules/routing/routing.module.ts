import { Global, Module } from '@nestjs/common';
import { RouteResolverService } from './route-resolver.service.js';

@Global()
@Module({
  providers: [RouteResolverService],
  exports: [RouteResolverService],
})
export class RoutingModule {}
