import { BadRequestException } from '@nestjs/common';

export class InvalidModuleIdException extends BadRequestException {
  constructor(id: string) {
    super({
      error: 'INVALID_MODULE_ID',
      message: `Module ${id} does not exist.`,
    });
  }
}
