import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const startedAt = process.hrtime.bigint();

    res.on('finish', () => {
      const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
      const user = req.user ? `${req.user.role}:${req.user.id}` : 'anonymous';
      const upstream = req.gatewayRoute?.upstream ?? 'gateway';
      const line =
        `[${req.requestId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} ` +
        `${elapsedMs.toFixed(1)}ms user=${user} upstream=${upstream}`;

      if (res.statusCode >= 500) this.logger.error(line);
      else if (res.statusCode >= 400) this.logger.warn(line);
      else this.logger.log(line);
    });

    next();
  }
}
