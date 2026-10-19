import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto.js';
import { PaginationMetaDto } from '../../../shared/dto/pagination-meta.dto.js';

export class UserPageDto {
  @ApiProperty({ type: [UserDto] })
  data: UserDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
