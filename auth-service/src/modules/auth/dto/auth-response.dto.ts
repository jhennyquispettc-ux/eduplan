import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto.js';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'kq3J...base64url' })
  refreshToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: 'Bearer';

  @ApiProperty({
    example: 900,
    description: 'Segundos de vida del access token',
  })
  expiresIn: number;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
