import { ApiProperty } from '@nestjs/swagger';
import { CourseDto } from './course.dto.js';
import { PaginationMetaDto } from '../../../shared/dto/pagination-meta.dto.js';

export class CoursePageDto {
  @ApiProperty({ type: [CourseDto] })
  data: CourseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
