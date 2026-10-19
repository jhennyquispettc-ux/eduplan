import { ForbiddenException } from '@nestjs/common';

export class InsufficientRoleException extends ForbiddenException {
  constructor() {
    super({
      error: 'INSUFFICIENT_ROLE',
      message: 'You do not have permission to perform this action.',
    });
  }
}
