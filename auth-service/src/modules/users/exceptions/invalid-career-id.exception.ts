import { BadRequestException } from '@nestjs/common';

export class InvalidCareerIdException extends BadRequestException {
  constructor(id: string) {
    super({
      error: 'INVALID_CAREER_ID',
      message: `Career ${id} does not exist.`,
    });
  }
}
