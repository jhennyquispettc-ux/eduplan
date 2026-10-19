import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MaxLength } from 'class-validator';
import { UserProfileFieldsDto } from './user-profile-fields.dto.js';
import { NormalizeEmail } from '../../../shared/decorators/normalize-email.decorator.js';
import { IsStrongPassword } from '../../../shared/decorators/is-strong-password.decorator.js';

export class NewUserDto extends UserProfileFieldsDto {
  @ApiProperty({ example: 'maria.quispe@gmail.com', maxLength: 150 })
  @NormalizeEmail()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    example: 'Nivelate2026',
    minLength: 8,
    maxLength: 72,
    description: 'Al menos una letra y un número',
  })
  @IsStrongPassword()
  password: string;
}
