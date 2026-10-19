import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  buildErrorResponse,
  writeErrorResponse,
} from '../http/error-response.js';

const STATUS_CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  429: 'TOO_MANY_REQUESTS',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
  504: 'GATEWAY_TIMEOUT',
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `[${request.requestId}] ${request.method} ${request.originalUrl}`,
        (exception as Error)?.stack,
      );
      writeErrorResponse(
        response,
        buildErrorResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'INTERNAL_SERVER_ERROR',
          'Internal server error.',
          request.originalUrl,
        ),
      );
      return;
    }

    const status = exception.getStatus();
    const body = exception.getResponse();

    if (this.isHealthReport(body)) {
      response.status(status).json(body);
      return;
    }

    const { message, error } =
      typeof body === 'string'
        ? { message: body, error: undefined }
        : (body as { message?: string | string[]; error?: string });
    const isDomainCode =
      typeof error === 'string' && /^[A-Z0-9_]+$/.test(error);

    writeErrorResponse(
      response,
      buildErrorResponse(
        status,
        isDomainCode ? error : (STATUS_CODES[status] ?? 'HTTP_ERROR'),
        message ?? exception.message,
        request.originalUrl,
      ),
    );
  }

  private isHealthReport(body: unknown): boolean {
    return (
      typeof body === 'object' &&
      body !== null &&
      'status' in body &&
      'details' in body
    );
  }
}
