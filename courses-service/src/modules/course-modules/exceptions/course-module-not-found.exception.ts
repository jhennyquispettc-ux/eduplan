import { NotFoundException } from '@nestjs/common';

export class CourseModuleNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({
      error: 'MODULE_NOT_FOUND',
      message: `Module ${id} was not found.`,
    });
  }
}
