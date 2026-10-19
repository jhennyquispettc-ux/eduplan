import { Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientRequest, ServerResponse } from 'node:http';
import {
  createProxyMiddleware,
  type RequestHandler,
} from 'http-proxy-middleware';
import { GatewayConfig } from '../../config/services/gateway.config.js';
import { Upstream } from '../routing/upstream.enum.js';
import {
  AUTHORIZATION_HEADER,
  REQUEST_ID_HEADER,
  USER_ID_HEADER,
  USER_ROLE_HEADER,
} from '../../shared/http/headers.js';
import {
  buildErrorResponse,
  writeErrorResponse,
} from '../../shared/http/error-response.js';

const TIMEOUT_ERROR_CODES = new Set(['ETIMEDOUT', 'ESOCKETTIMEDOUT']);

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly handlers: Record<
    Upstream,
    RequestHandler<Request, Response>
  >;

  constructor(private readonly config: GatewayConfig) {
    this.handlers = {
      [Upstream.AUTH]: this.createHandler(Upstream.AUTH),
      [Upstream.COURSES]: this.createHandler(Upstream.COURSES),
    };
  }

  async forward(
    upstream: Upstream,
    req: Request,
    res: Response,
  ): Promise<void> {
    await this.handlers[upstream](req, res, (error?: unknown) => {
      if (error) this.handleError(upstream, error as Error, req, res);
    });
  }

  private createHandler(upstream: Upstream): RequestHandler<Request, Response> {
    return createProxyMiddleware<Request, Response>({
      target: this.config.upstreams[upstream],
      changeOrigin: true,
      xfwd: true,
      proxyTimeout: this.config.proxyTimeoutMs,
      timeout: this.config.proxyTimeoutMs,
      on: {
        proxyReq: (proxyReq, req) => this.propagateIdentity(proxyReq, req),
        error: (error, req, res) =>
          this.handleError(upstream, error, req, res as Response),
      },
    });
  }

  private propagateIdentity(proxyReq: ClientRequest, req: Request): void {
    proxyReq.removeHeader(USER_ID_HEADER);
    proxyReq.removeHeader(USER_ROLE_HEADER);
    proxyReq.removeHeader(AUTHORIZATION_HEADER);

    if (req.requestId) proxyReq.setHeader(REQUEST_ID_HEADER, req.requestId);
    if (req.user) {
      proxyReq.setHeader(USER_ID_HEADER, req.user.id);
      proxyReq.setHeader(USER_ROLE_HEADER, req.user.role);
    }
  }

  private handleError(
    upstream: Upstream,
    error: Error & { code?: string },
    req: Request,
    res: Response | ServerResponse,
  ): void {
    const isTimeout =
      TIMEOUT_ERROR_CODES.has(error.code ?? '') ||
      /timeout/i.test(error.message);
    this.logger.error(
      `[${req.requestId}] ${upstream} ${isTimeout ? 'timed out' : 'unreachable'}: ${error.code ?? error.message}`,
    );

    writeErrorResponse(
      res,
      isTimeout
        ? buildErrorResponse(
            504,
            'UPSTREAM_TIMEOUT',
            `${upstream} did not respond in time.`,
            req.originalUrl,
          )
        : buildErrorResponse(
            502,
            'UPSTREAM_UNAVAILABLE',
            `${upstream} is not available right now.`,
            req.originalUrl,
          ),
    );
  }
}
