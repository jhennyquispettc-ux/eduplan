import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto.js';
import { PaginationMetaDto } from '../../../shared/dto/pagination-meta.dto.js';

export class CategoryPageDto {
  @ApiProperty({ type: [CategoryDto] })
  data: CategoryDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
