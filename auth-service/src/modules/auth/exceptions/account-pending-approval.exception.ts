import { ForbiddenException } from '@nestjs/common';

export class AccountPendingApprovalException extends ForbiddenException {
  constructor() {
    super({
      error: 'ACCOUNT_PENDING_APPROVAL',
      message: 'Your account is pending approval by an administrator.',
    });
  }
}
