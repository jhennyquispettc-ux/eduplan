import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service.js';
import { UserDto } from '../dto/user.dto.js';
import { UserPageDto } from '../dto/user-page.dto.js';
import { UserQueryDto } from '../dto/user-query.dto.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto.js';
import {
  ApiConflict,
  ApiNotFound,
  ApiUnprocessable,
  ApiValidationError,
} from '../../../shared/swagger/api-error.decorators.js';
import {
  ApiUserHeaders,
  CurrentUser,
  type RequestUser,
} from '../../../shared/auth/request-user.js';

const NOT_FOUND = {
  code: 'USER_NOT_FOUND',
  message: 'User <id> was not found.',
};
const EMAIL_TAKEN = {
  code: 'EMAIL_ALREADY_EXISTS',
  message: 'The email maria.quispe@gmail.com is already registered.',
};
const INVALID_CAREER = {
  code: 'INVALID_CAREER_ID',
  message: 'Career <id> does not exist.',
};
const OWN_ACCOUNT = {
  code: 'CANNOT_MODIFY_OWN_ACCOUNT',
  message:
    'Administrators cannot change the role, status or existence of their own account.',
};

@ApiTags('Users (admin)')
@ApiUserHeaders()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios (filtros por estado y rol)' })
  @ApiOkResponse({ type: UserPageDto })
  @ApiValidationError()
  findAll(@Query() query: UserQueryDto): Promise<UserPageDto> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por id' })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFound(NOT_FOUND)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un usuario (por defecto STUDENT y ACTIVE)' })
  @ApiCreatedResponse({ type: UserDto })
  @ApiValidationError(INVALID_CAREER)
  @ApiConflict(EMAIL_TAKEN)
  create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos, rol o contraseña de un usuario' })
  @ApiOkResponse({ type: UserDto })
  @ApiValidationError(INVALID_CAREER)
  @ApiNotFound(NOT_FOUND)
  @ApiConflict(EMAIL_TAKEN)
  @ApiUnprocessable(OWN_ACCOUNT)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() actor: RequestUser,
  ): Promise<UserDto> {
    return this.usersService.update(id, dto, actor.id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary:
      'Aprobar (ACTIVE), desactivar (INACTIVE) o dejar pendiente a un usuario',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiValidationError()
  @ApiNotFound(NOT_FOUND)
  @ApiUnprocessable(OWN_ACCOUNT)
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() actor: RequestUser,
  ): Promise<UserDto> {
    return this.usersService.changeStatus(id, dto.status, actor.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario (borrado lógico)' })
  @ApiNoContentResponse()
  @ApiNotFound(NOT_FOUND)
  @ApiUnprocessable(OWN_ACCOUNT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() actor: RequestUser,
  ): Promise<void> {
    return this.usersService.remove(id, actor.id);
  }
}
