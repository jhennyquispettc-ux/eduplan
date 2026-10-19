import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity.js';
import { UserRole } from '../../../shared/auth/user-role.enum.js';
import { UserStatus } from '../enums/user-status.enum.js';

export class UserDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'María' })
  firstName: string;

  @ApiProperty({ example: 'Quispe Mamani' })
  lastName: string;

  @ApiProperty({ example: 'maria.quispe@gmail.com' })
  email: string;

  @ApiProperty({ example: '+591 71234567' })
  phone: string;

  @ApiProperty({ example: 'U.E. Coroico' })
  school: string;

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  careerId: string | null;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role: UserRole;

  @ApiProperty({ enum: UserStatus, enumName: 'UserStatus' })
  status: UserStatus;

  @ApiProperty({ type: String, nullable: true })
  lastLoginAt: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  static fromEntity(entity: User): UserDto {
    const dto = new UserDto();
    dto.id = entity.id;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.email = entity.email;
    dto.phone = entity.phone;
    dto.school = entity.school;
    dto.careerId = entity.careerId;
    dto.role = entity.role;
    dto.status = entity.status;
    dto.lastLoginAt = entity.lastLoginAt?.toISOString() ?? null;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
