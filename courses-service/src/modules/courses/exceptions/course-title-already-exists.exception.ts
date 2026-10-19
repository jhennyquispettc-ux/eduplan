import { ConflictException } from '@nestjs/common';

export class CourseTitleAlreadyExistsException extends ConflictException {
  constructor(title: string) {
    super({
      error: 'COURSE_TITLE_ALREADY_EXISTS',
      message: `A course titled "${title}" already exists.`,
    });
  }
}
