import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto.js';
import { CourseStatus } from '../enums/course-status.enum.js';

export class CourseQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: CourseStatus,
    enumName: 'CourseStatus',
    description:
      'Solo aplica para ADMIN; los estudiantes siempre ven PUBLISHED',
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}
