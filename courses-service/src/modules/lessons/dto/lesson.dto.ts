import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from '../entities/lesson.entity.js';
import { LessonType } from '../enums/lesson-type.enum.js';

export class LessonDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  moduleId: string;

  @ApiProperty({ example: 'Productos notables' })
  title: string;

  @ApiProperty({ enum: LessonType, enumName: 'LessonType' })
  type: LessonType;

  @ApiProperty({
    type: String,
    nullable: true,
    example: '## Cuadrado de un binomio\n(a + b)² = a² + 2ab + b²',
  })
  content: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'https://www.youtube.com/watch?v=abc123',
  })
  videoUrl: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  static fromEntity(entity: Lesson): LessonDto {
    const dto = new LessonDto();
    dto.id = entity.id;
    dto.moduleId = entity.moduleId;
    dto.title = entity.title;
    dto.type = entity.type;
    dto.content = entity.content;
    dto.videoUrl = entity.videoUrl;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
