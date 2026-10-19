import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';
import { REQUEST_ID_HEADER } from '../shared/http/headers.js';
import { THROTTLER_NAMES } from '../modules/rate-limit/throttler-names.js';

export function buildCorsOptions(allowedOrigins: string): CorsOptions {
  const origins =
    allowedOrigins.trim() === '*'
      ? true
      : allowedOrigins.split(',').map((origin) => origin.trim());

  return {
    origin: origins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', REQUEST_ID_HEADER],
    exposedHeaders: [
      REQUEST_ID_HEADER,
      ...THROTTLER_NAMES.flatMap((name) => [
        `X-RateLimit-Limit-${name}`,
        `X-RateLimit-Remaining-${name}`,
        `X-RateLimit-Reset-${name}`,
        `Retry-After-${name}`,
      ]),
    ],
    maxAge: 600,
  };
}
