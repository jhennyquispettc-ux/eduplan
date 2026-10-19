import { Upstream } from './upstream.enum.js';
import {
  ADMIN_ONLY,
  AUTHENTICATED,
  PUBLIC,
  type AccessPolicy,
} from './access-policy.js';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  access: AccessPolicy;
  upstream: Upstream | null;
  credentials?: boolean;
}

const auth = (
  method: HttpMethod,
  path: string,
  access: AccessPolicy,
  credentials = false,
): RouteDefinition => ({
  method,
  path,
  access,
  upstream: Upstream.AUTH,
  credentials,
});

const courses = (
  method: HttpMethod,
  path: string,
  access: AccessPolicy,
): RouteDefinition => ({ method, path, access, upstream: Upstream.COURSES });

const catalogResource = (
  resource: string,
  readAccess: AccessPolicy = AUTHENTICATED,
): RouteDefinition[] => [
  courses('GET', `/${resource}`, readAccess),
  courses('GET', `/${resource}/:id`, readAccess),
  courses('POST', `/${resource}`, ADMIN_ONLY),
  courses('PATCH', `/${resource}/:id`, ADMIN_ONLY),
  courses('DELETE', `/${resource}/:id`, ADMIN_ONLY),
];

export const ROUTE_TABLE: readonly RouteDefinition[] = [
  { method: 'GET', path: '/health', access: PUBLIC, upstream: null },

  auth('POST', '/auth/register', PUBLIC, true),
  auth('POST', '/auth/login', PUBLIC, true),
  auth('POST', '/auth/refresh', PUBLIC),
  auth('POST', '/auth/logout', PUBLIC),

  auth('GET', '/users/me', AUTHENTICATED),
  auth('PATCH', '/users/me', AUTHENTICATED),
  auth('PATCH', '/users/me/password', AUTHENTICATED),
  auth('GET', '/users', ADMIN_ONLY),
  auth('GET', '/users/:id', ADMIN_ONLY),
  auth('POST', '/users', ADMIN_ONLY),
  auth('PATCH', '/users/:id', ADMIN_ONLY),
  auth('PATCH', '/users/:id/status', ADMIN_ONLY),
  auth('DELETE', '/users/:id', ADMIN_ONLY),

  ...catalogResource('careers', PUBLIC),
  ...catalogResource('categories'),
  ...catalogResource('courses'),
  courses('GET', '/courses/:id/export', AUTHENTICATED),
  courses('PATCH', '/courses/:id/status', ADMIN_ONLY),
  ...catalogResource('modules'),
  ...catalogResource('lessons'),
];
