import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { NormalizeEmail } from '../../../shared/decorators/normalize-email.decorator.js';

export class LoginDto {
  @ApiProperty({ example: 'maria.quispe@gmail.com' })
  @NormalizeEmail()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Nivelate2026' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
