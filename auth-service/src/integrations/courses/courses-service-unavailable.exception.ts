import { ServiceUnavailableException } from '@nestjs/common';

export class CoursesServiceUnavailableException extends ServiceUnavailableException {
  constructor() {
    super({
      error: 'COURSES_SERVICE_UNAVAILABLE',
      message: 'The careers catalog could not be reached. Try again later.',
    });
  }
}
