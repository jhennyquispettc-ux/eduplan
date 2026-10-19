import { UnprocessableEntityException } from '@nestjs/common';

export class CourseNotPublishableException extends UnprocessableEntityException {
  constructor(id: string) {
    super({
      error: 'COURSE_NOT_PUBLISHABLE',
      message: `Course ${id} needs at least one lesson before it can be published.`,
    });
  }
}
