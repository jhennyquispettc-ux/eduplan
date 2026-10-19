import { ServerResponse } from 'node:http';

export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

export function buildErrorResponse(
  statusCode: number,
  error: string,
  message: string | string[],
  path: string,
): ErrorResponse {
  return {
    statusCode,
    error,
    message,
    path,
    timestamp: new Date().toISOString(),
  };
}

export function writeErrorResponse(
  res: ServerResponse,
  body: ErrorResponse,
): void {
  if (res.headersSent) {
    res.end();
    return;
  }
  res.statusCode = body.statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}
