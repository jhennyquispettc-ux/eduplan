import type { AuthenticatedUser } from '../auth/authenticated-user.js';
import type { ResolvedRoute } from '../../modules/routing/route-resolver.service.js';

declare module 'express-serve-static-core' {
  interface Request {
    requestId?: string;
    user?: AuthenticatedUser;
    gatewayRoute?: ResolvedRoute;
  }
}
