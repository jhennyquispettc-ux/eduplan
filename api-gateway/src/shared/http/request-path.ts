import { Request } from 'express';

export function requestPath(req: Request): string {
  return req.originalUrl.split('?')[0];
}
