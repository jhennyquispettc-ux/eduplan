import { PartialType } from '@nestjs/swagger';
import { CreateCareerDto } from './create-career.dto.js';

export class UpdateCareerDto extends PartialType(CreateCareerDto) {}
