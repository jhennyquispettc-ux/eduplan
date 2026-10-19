import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'USER_NOT_FOUND' })
  error: string;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'User not found.',
  })
  message: string | string[];

  @ApiProperty({ example: '/api/users/0b6f...' })
  path: string;

  @ApiProperty({ example: '2026-10-18T12:00:00.000Z' })
  timestamp: string;
}
