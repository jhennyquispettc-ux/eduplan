import { NotFoundException } from '@nestjs/common';

export class CourseNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({
      error: 'COURSE_NOT_FOUND',
      message: `Course ${id} was not found.`,
    });
  }
}
