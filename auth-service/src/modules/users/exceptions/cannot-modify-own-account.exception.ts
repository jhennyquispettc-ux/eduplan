import { UnprocessableEntityException } from '@nestjs/common';

export class CannotModifyOwnAccountException extends UnprocessableEntityException {
  constructor() {
    super({
      error: 'CANNOT_MODIFY_OWN_ACCOUNT',
      message:
        'Administrators cannot change the role, status or existence of their own account.',
    });
  }
}
