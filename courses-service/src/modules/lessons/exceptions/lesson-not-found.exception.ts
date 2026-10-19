import { NotFoundException } from '@nestjs/common';

export class LessonNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({
      error: 'LESSON_NOT_FOUND',
      message: `Lesson ${id} was not found.`,
    });
  }
}
