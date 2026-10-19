import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'CATEGORY_NOT_FOUND' })
  error: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'Category not found.',
  })
  message: string | string[];

  @ApiProperty({ example: '/api/categories/0b6f...' })
  path: string;

  @ApiProperty({ example: '2026-10-18T12:00:00.000Z' })
  timestamp: string;
}
