import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AUTHENTICATED, PUBLIC } from '../routing/access-policy.js';
import { AccessTokenVerifier } from './access-token.verifier.js';
import { AUTHORIZATION_HEADER } from '../../shared/http/headers.js';
import {
  InsufficientRoleException,
  MissingTokenException,
  RouteNotFoundException,
} from './exceptions/index.js';
import { requestPath } from '../../shared/http/request-path.js';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly tokenVerifier: AccessTokenVerifier) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const route = request.gatewayRoute;
    if (!route)
      throw new RouteNotFoundException(request.method, requestPath(request));

    if (route.access === PUBLIC) return true;

    const token = this.extractBearerToken(request);
    if (!token) throw new MissingTokenException();
    request.user = await this.tokenVerifier.verify(token);

    if (route.access === AUTHENTICATED) return true;
    if (!route.access.includes(request.user.role)) {
      throw new InsufficientRoleException();
    }
    return true;
  }

  private extractBearerToken(request: Request): string | null {
    const header = request.header(AUTHORIZATION_HEADER);
    if (!header) return null;
    const [scheme, token] = header.split(' ');
    return scheme?.toLowerCase() === 'bearer' && token ? token : null;
  }
}
