import { BadRequestException } from '@nestjs/common';

export class InvalidCurrentPasswordException extends BadRequestException {
  constructor() {
    super({
      error: 'INVALID_CURRENT_PASSWORD',
      message: 'The current password is incorrect.',
    });
  }
}
