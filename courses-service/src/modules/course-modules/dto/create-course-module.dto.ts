import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../../shared/decorators/trim.decorator.js';

export class CreateCourseModuleDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  courseId: string;

  @ApiProperty({ example: 'Álgebra básica', maxLength: 150 })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({
    example: 'Expresiones algebraicas y productos notables',
    maxLength: 1000,
  })
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
