import { ConflictException } from '@nestjs/common';

export class CategoryHasCoursesException extends ConflictException {
  constructor(id: string) {
    super({
      error: 'CATEGORY_HAS_COURSES',
      message: `Category ${id} still has courses and cannot be deleted.`,
    });
  }
}
