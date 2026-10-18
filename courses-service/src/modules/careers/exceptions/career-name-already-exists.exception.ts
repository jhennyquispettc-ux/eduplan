import { ConflictException } from '@nestjs/common';

export class CareerNameAlreadyExistsException extends ConflictException {
  constructor(name: string) {
    super({
      error: 'CAREER_NAME_ALREADY_EXISTS',
      message: `A career named "${name}" already exists.`,
    });
  }
}
