import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: 5 })
  pages: number;

  static build(page: number, limit: number, total: number): PaginationMetaDto {
    const meta = new PaginationMetaDto();
    meta.page = page;
    meta.limit = limit;
    meta.total = total;
    meta.pages = Math.ceil(total / limit);
    return meta;
  }
}
