import { NotFoundException } from '@nestjs/common';

export class CareerNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({
      error: 'CAREER_NOT_FOUND',
      message: `Career ${id} was not found.`,
    });
  }
}
