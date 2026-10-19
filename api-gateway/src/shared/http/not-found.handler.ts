import { Request, Response } from 'express';
import { buildErrorResponse, writeErrorResponse } from './error-response.js';
import { requestPath } from './request-path.js';

export function notFoundHandler(req: Request, res: Response): void {
  const path = requestPath(req);
  writeErrorResponse(
    res,
    buildErrorResponse(
      404,
      'ROUTE_NOT_FOUND',
      `Route ${req.method} ${path} does not exist.`,
      req.originalUrl,
    ),
  );
}
