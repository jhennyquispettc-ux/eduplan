import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateLessonDto } from './create-lesson.dto.js';

export class UpdateLessonDto extends PartialType(
  OmitType(CreateLessonDto, ['moduleId'] as const),
) {}
