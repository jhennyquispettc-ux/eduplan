import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../entities/course.entity.js';
import { CourseStatus } from '../enums/course-status.enum.js';

export class CourseCategoryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Matemáticas' })
  name: string;
}

export class CourseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Matemática para ingeniería' })
  title: string;

  @ApiProperty({
    example:
      'Nivelación en álgebra, trigonometría y funciones para postulantes a ingeniería.',
  })
  description: string;

  @ApiProperty({ type: String, nullable: true })
  coverImageUrl: string | null;

  @ApiProperty({ type: Number, nullable: true, example: 40 })
  estimatedHours: number | null;

  @ApiProperty({ enum: CourseStatus, enumName: 'CourseStatus' })
  status: CourseStatus;

  @ApiProperty({ type: CourseCategoryDto })
  category: CourseCategoryDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  static fromEntity(entity: Course): CourseDto {
    return CourseDto.fill(new CourseDto(), entity);
  }

  protected static fill<T extends CourseDto>(dto: T, entity: Course): T {
    dto.id = entity.id;
    dto.title = entity.title;
    dto.description = entity.description;
    dto.coverImageUrl = entity.coverImageUrl;
    dto.estimatedHours = entity.estimatedHours;
    dto.status = entity.status;
    dto.category = { id: entity.category.id, name: entity.category.name };
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
