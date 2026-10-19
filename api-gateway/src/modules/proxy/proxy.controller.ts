import { All, Controller, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ProxyService } from './proxy.service.js';
import { RouteNotFoundException } from '../access/exceptions/index.js';
import { requestPath } from '../../shared/http/request-path.js';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*path')
  forward(@Req() req: Request, @Res() res: Response): Promise<void> {
    const upstream = req.gatewayRoute?.upstream;
    if (!upstream)
      throw new RouteNotFoundException(req.method, requestPath(req));
    return this.proxyService.forward(upstream, req, res);
  }
}
