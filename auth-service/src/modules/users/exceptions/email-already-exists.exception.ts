import { ConflictException } from '@nestjs/common';

export class EmailAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super({
      error: 'EMAIL_ALREADY_EXISTS',
      message: `The email ${email} is already registered.`,
    });
  }
}
