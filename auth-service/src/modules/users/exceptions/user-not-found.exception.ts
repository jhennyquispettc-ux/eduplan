import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({ error: 'USER_NOT_FOUND', message: `User ${id} was not found.` });
  }
}
