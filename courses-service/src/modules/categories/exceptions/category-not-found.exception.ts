import { NotFoundException } from '@nestjs/common';

export class CategoryNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({
      error: 'CATEGORY_NOT_FOUND',
      message: `Category ${id} was not found.`,
    });
  }
}
