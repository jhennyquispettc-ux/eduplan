import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Trim } from '../../../shared/decorators/trim.decorator.js';

export class CreateCareerDto {
  @ApiProperty({ example: 'Medicina', maxLength: 150 })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({
    example: 'Estudio, diagnóstico y tratamiento de enfermedades',
    maxLength: 1000,
  })
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
