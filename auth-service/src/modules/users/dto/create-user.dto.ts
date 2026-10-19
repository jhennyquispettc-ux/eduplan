import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { NewUserDto } from './new-user.dto.js';
import { UserRole } from '../../../shared/auth/user-role.enum.js';
import { UserStatus } from '../enums/user-status.enum.js';

export class CreateUserDto extends NewUserDto {
  @ApiPropertyOptional({
    enum: UserRole,
    enumName: 'UserRole',
    default: UserRole.STUDENT,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    enum: UserStatus,
    enumName: 'UserStatus',
    default: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
