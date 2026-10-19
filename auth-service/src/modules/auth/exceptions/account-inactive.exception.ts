import { ForbiddenException } from '@nestjs/common';

export class AccountInactiveException extends ForbiddenException {
  constructor() {
    super({
      error: 'ACCOUNT_INACTIVE',
      message: 'Your account has been deactivated. Contact an administrator.',
    });
  }
}
