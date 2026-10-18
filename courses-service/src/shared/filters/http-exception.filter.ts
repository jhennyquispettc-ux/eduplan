import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ErrorResponseDto } from '../dto/error-response.dto.js';

const PG_UNIQUE_VIOLATION = '23505';
const PG_FOREIGN_KEY_VIOLATION = '23503';

interface ResolvedError {
  status: number;
  error: string;
  message: string | string[];
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { status, error, message } = this.resolve(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${request.method}] ${request.url} -> ${status}`,
        (exception as Error)?.stack,
      );
    }

    const body: ErrorResponseDto = {
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }

  private resolve(exception: unknown): ResolvedError {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        return { status, error: this.statusToCode(status), message: body };
      }

      const { message, error } = body as {
        message?: string | string[];
        error?: string;
      };
      const isDomainCode =
        typeof error === 'string' && /^[A-Z0-9_]+$/.test(error);

      return {
        status,
        error: isDomainCode ? error : this.statusToCode(status),
        message: message ?? exception.message,
      };
    }

    if (exception instanceof QueryFailedError) {
      const code = (exception.driverError as { code?: string } | undefined)
        ?.code;

      if (code === PG_UNIQUE_VIOLATION) {
        return {
          status: HttpStatus.CONFLICT,
          error: 'ALREADY_EXISTS',
          message: 'A record with that value already exists.',
        };
      }

      if (code === PG_FOREIGN_KEY_VIOLATION) {
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'INVALID_REFERENCE',
          message: 'One of the referenced records does not exist.',
        };
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error.',
    };
  }

  private statusToCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
    };
    return codes[status] ?? 'HTTP_ERROR';
  }
}
