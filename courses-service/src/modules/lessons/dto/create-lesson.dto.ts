import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../../shared/decorators/trim.decorator.js';
import { LessonType } from '../enums/lesson-type.enum.js';

export class CreateLessonDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  moduleId: string;

  @ApiProperty({ example: 'Productos notables', maxLength: 150 })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({ enum: LessonType, enumName: 'LessonType' })
  @IsEnum(LessonType)
  type: LessonType;

  @ApiPropertyOptional({
    description: 'Obligatorio para TEXT (markdown). Opcional para VIDEO.',
    example: '## Cuadrado de un binomio\n(a + b)² = a² + 2ab + b²',
    maxLength: 50000,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50000)
  content?: string;

  @ApiPropertyOptional({
    description: 'Obligatorio para VIDEO. No permitido para TEXT.',
    example: 'https://www.youtube.com/watch?v=abc123',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  videoUrl?: string;
}
