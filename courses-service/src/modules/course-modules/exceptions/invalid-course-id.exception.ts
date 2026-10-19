import { BadRequestException } from '@nestjs/common';

export class InvalidCourseIdException extends BadRequestException {
  constructor(id: string) {
    super({
      error: 'INVALID_COURSE_ID',
      message: `Course ${id} does not exist.`,
    });
  }
}
