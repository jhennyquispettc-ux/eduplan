import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Trim } from '../../../shared/decorators/trim.decorator.js';

export class CreateCourseDto {
  @ApiProperty({ example: 'Matemática para ingeniería', maxLength: 150 })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    example:
      'Nivelación en álgebra, trigonometría y funciones para postulantes a ingeniería.',
    maxLength: 5000,
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @ApiPropertyOptional({
    example: 'https://cdn.eduplan.bo/covers/matematica-ingenieria.jpg',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  coverImageUrl?: string;

  @ApiPropertyOptional({ example: 40, minimum: 1, maximum: 500 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  estimatedHours?: number;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  categoryId: string;
}
