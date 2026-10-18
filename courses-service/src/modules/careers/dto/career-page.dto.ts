import { ApiProperty } from '@nestjs/swagger';
import { CareerDto } from './career.dto.js';
import { PaginationMetaDto } from '../../../shared/dto/pagination-meta.dto.js';

export class CareerPageDto {
  @ApiProperty({ type: [CareerDto] })
  data: CareerDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}
