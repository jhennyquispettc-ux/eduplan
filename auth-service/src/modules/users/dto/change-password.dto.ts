import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../../../shared/decorators/is-strong-password.decorator.js';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Nivelate2026' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'Yungas2027', minLength: 8, maxLength: 72 })
  @IsStrongPassword()
  newPassword: string;
}
