import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCourseModuleDto } from './create-course-module.dto.js';

export class UpdateCourseModuleDto extends PartialType(
  OmitType(CreateCourseModuleDto, ['courseId'] as const),
) {}
