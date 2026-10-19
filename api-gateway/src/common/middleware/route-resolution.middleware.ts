import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RouteResolverService } from '../../modules/routing/route-resolver.service.js';
import { requestPath } from '../../shared/http/request-path.js';

@Injectable()
export class RouteResolutionMiddleware implements NestMiddleware {
  constructor(private readonly routeResolver: RouteResolverService) {}

  use(req: Request, _res: Response, next: NextFunction): void {
    req.gatewayRoute =
      this.routeResolver.resolve(req.method, requestPath(req)) ?? undefined;
    next();
  }
}
