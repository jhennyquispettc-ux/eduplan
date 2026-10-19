import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { Trim } from '../../../shared/decorators/trim.decorator.js';

export class UserProfileFieldsDto {
  @ApiProperty({ example: 'María', maxLength: 80 })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  firstName: string;

  @ApiProperty({ example: 'Quispe Mamani', maxLength: 80 })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  lastName: string;

  @ApiProperty({ example: '+591 71234567', maxLength: 20 })
  @Trim()
  @IsString()
  @Matches(/^\+?[0-9][0-9\s-]{6,19}$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @ApiProperty({ example: 'U.E. Coroico', maxLength: 150 })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  school: string;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
    description: 'Carrera de interés (catálogo de courses-service)',
  })
  @IsOptional()
  @IsUUID()
  careerId?: string | null;
}
