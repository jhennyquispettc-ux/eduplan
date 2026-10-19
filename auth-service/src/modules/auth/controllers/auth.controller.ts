import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service.js';
import { RegisterDto } from '../dto/register.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { RefreshTokenDto } from '../dto/refresh-token.dto.js';
import { AuthResponseDto } from '../dto/auth-response.dto.js';
import { UserDto } from '../../users/dto/user.dto.js';
import {
  ApiConflict,
  ApiValidationError,
} from '../../../shared/swagger/api-error.decorators.js';
import { ErrorResponseDto } from '../../../shared/dto/error-response.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registro de estudiante',
    description:
      'La cuenta queda PENDING hasta que un administrador la apruebe.',
  })
  @ApiCreatedResponse({ type: UserDto })
  @ApiValidationError({
    code: 'INVALID_CAREER_ID',
    message: 'Career <id> does not exist.',
  })
  @ApiConflict({
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'The email maria.quispe@gmail.com is already registered.',
  })
  @ApiResponse({
    status: 503,
    type: ErrorResponseDto,
    description: 'COURSES_SERVICE_UNAVAILABLE: no se pudo validar la carrera.',
  })
  register(@Body() dto: RegisterDto): Promise<UserDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiValidationError()
  @ApiResponse({
    status: 401,
    type: ErrorResponseDto,
    description: 'INVALID_CREDENTIALS',
  })
  @ApiResponse({
    status: 403,
    type: ErrorResponseDto,
    description: 'ACCOUNT_PENDING_APPROVAL o ACCOUNT_INACTIVE',
  })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar tokens',
    description:
      'Invalida el refresh token recibido y entrega uno nuevo (rotación).',
  })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiValidationError()
  @ApiResponse({
    status: 401,
    type: ErrorResponseDto,
    description: 'INVALID_REFRESH_TOKEN o REFRESH_TOKEN_REUSED',
  })
  @ApiResponse({
    status: 403,
    type: ErrorResponseDto,
    description: 'ACCOUNT_PENDING_APPROVAL o ACCOUNT_INACTIVE',
  })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cerrar sesión (revoca el refresh token)' })
  @ApiNoContentResponse()
  @ApiValidationError()
  logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(dto.refreshToken);
  }
}
