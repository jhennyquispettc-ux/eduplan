import { NotFoundException } from '@nestjs/common';

export class RouteNotFoundException extends NotFoundException {
  constructor(method: string, path: string) {
    super({
      error: 'ROUTE_NOT_FOUND',
      message: `Route ${method} ${path} does not exist.`,
    });
  }
}
