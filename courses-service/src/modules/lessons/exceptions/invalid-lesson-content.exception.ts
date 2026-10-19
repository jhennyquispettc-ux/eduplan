import { BadRequestException } from '@nestjs/common';

export class InvalidLessonContentException extends BadRequestException {
  constructor(message: string) {
    super({ error: 'INVALID_LESSON_CONTENT', message });
  }
}
