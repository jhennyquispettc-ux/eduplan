import { ApiProperty } from '@nestjs/swagger';
import { CourseModuleEntity } from '../entities/course-module.entity.js';

export class CourseModuleDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  courseId: string;

  @ApiProperty({ example: 'Álgebra básica' })
  title: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Expresiones algebraicas y productos notables',
  })
  description: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  static fromEntity(entity: CourseModuleEntity): CourseModuleDto {
    const dto = new CourseModuleDto();
    dto.id = entity.id;
    dto.courseId = entity.courseId;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
