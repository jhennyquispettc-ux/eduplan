import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service.js';
import { UserDto } from '../dto/user.dto.js';
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { ChangePasswordDto } from '../dto/change-password.dto.js';
import {
  ApiNotFound,
  ApiValidationError,
} from '../../../shared/swagger/api-error.decorators.js';
import {
  ApiUserHeaders,
  CurrentUser,
  type RequestUser,
} from '../../../shared/auth/request-user.js';
import { requireUserId } from '../../../shared/auth/require-user-id.js';

const USER_NOT_FOUND = {
  code: 'USER_NOT_FOUND',
  message: 'User <id> was not found.',
};
const INVALID_CAREER = {
  code: 'INVALID_CAREER_ID',
  message: 'Career <id> does not exist.',
};

@ApiTags('Profile')
@ApiUserHeaders()
@Controller('users/me')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Ver mi perfil' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFound(USER_NOT_FOUND)
  getProfile(@CurrentUser() user: RequestUser): Promise<UserDto> {
    return this.usersService.getProfile(requireUserId(user));
  }

  @Patch()
  @ApiOperation({
    summary: 'Actualizar mi perfil (nombre, teléfono, colegio, carrera)',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiValidationError(INVALID_CAREER)
  @ApiNotFound(USER_NOT_FOUND)
  updateProfile(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserDto> {
    return this.usersService.updateProfile(requireUserId(user), dto);
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cambiar mi contraseña' })
  @ApiNoContentResponse()
  @ApiValidationError({
    code: 'INVALID_CURRENT_PASSWORD',
    message: 'The current password is incorrect.',
  })
  changePassword(
    @CurrentUser() user: RequestUser,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return this.usersService.changePassword(requireUserId(user), dto);
  }
}
