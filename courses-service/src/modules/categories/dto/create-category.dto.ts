import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../shared/decorators/trim.decorator.js';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Matemáticas', maxLength: 100 })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Álgebra, trigonometría y cálculo básico',
    maxLength: 500,
  })
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
