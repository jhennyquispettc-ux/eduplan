import { ConflictException } from '@nestjs/common';

export class CategoryNameAlreadyExistsException extends ConflictException {
  constructor(name: string) {
    super({
      error: 'CATEGORY_NAME_ALREADY_EXISTS',
      message: `A category named "${name}" already exists.`,
    });
  }
}
