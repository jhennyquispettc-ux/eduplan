import { BadRequestException } from '@nestjs/common';

export class InvalidCategoryIdException extends BadRequestException {
  constructor(id: string) {
    super({
      error: 'INVALID_CATEGORY_ID',
      message: `Category ${id} does not exist.`,
    });
  }
}
