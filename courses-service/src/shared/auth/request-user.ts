import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from './user-role.enum.js';

export const USER_ID_HEADER = 'x-user-id';
export const USER_ROLE_HEADER = 'x-user-role';

export interface RequestUser {
  id: string | null;
  role: UserRole;
}

export const isAdmin = (user: RequestUser): boolean =>
  user.role === UserRole.ADMIN;

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const role =
      request.header(USER_ROLE_HEADER) === UserRole.ADMIN
        ? UserRole.ADMIN
        : UserRole.STUDENT;

    return { id: request.header(USER_ID_HEADER) ?? null, role };
  },
);

export const ApiUserHeaders = () =>
  applyDecorators(
    ApiHeader({
      name: USER_ROLE_HEADER,
      required: false,
      enum: UserRole,
      description: 'Rol propagado por el API Gateway (por defecto STUDENT)',
    }),
    ApiHeader({
      name: USER_ID_HEADER,
      required: false,
      description: 'Id del usuario propagado por el API Gateway',
    }),
  );
