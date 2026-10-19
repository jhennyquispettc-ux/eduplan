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
import { CourseModulesService } from '../services/course-modules.service.js';
import { CourseModuleDto } from '../dto/course-module.dto.js';
import { CourseModuleQueryDto } from '../dto/course-module-query.dto.js';
import { CreateCourseModuleDto } from '../dto/create-course-module.dto.js';
import { UpdateCourseModuleDto } from '../dto/update-course-module.dto.js';
import {
  ApiNotFound,
  ApiValidationError,
} from '../../../shared/swagger/api-error.decorators.js';
import {
  ApiUserHeaders,
  CurrentUser,
  type RequestUser,
} from '../../../shared/auth/request-user.js';

const NOT_FOUND = {
  code: 'MODULE_NOT_FOUND',
  message: 'Module <id> was not found.',
};

@ApiTags('Modules')
@ApiUserHeaders()
@Controller('modules')
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar los módulos de un curso' })
  @ApiOkResponse({ type: [CourseModuleDto] })
  @ApiValidationError()
  @ApiNotFound({
    code: 'COURSE_NOT_FOUND',
    message: 'Course <id> was not found.',
  })
  findByCourse(
    @Query() query: CourseModuleQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<CourseModuleDto[]> {
    return this.courseModulesService.findByCourse(query.courseId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un módulo por id' })
  @ApiOkResponse({ type: CourseModuleDto })
  @ApiNotFound(NOT_FOUND)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<CourseModuleDto> {
    return this.courseModulesService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un módulo dentro de un curso' })
  @ApiCreatedResponse({ type: CourseModuleDto })
  @ApiValidationError({
    code: 'INVALID_COURSE_ID',
    message: 'Course <id> does not exist.',
  })
  create(@Body() dto: CreateCourseModuleDto): Promise<CourseModuleDto> {
    return this.courseModulesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un módulo' })
  @ApiOkResponse({ type: CourseModuleDto })
  @ApiValidationError()
  @ApiNotFound(NOT_FOUND)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseModuleDto,
  ): Promise<CourseModuleDto> {
    return this.courseModulesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un módulo con sus lecciones (borrado lógico)',
  })
  @ApiNoContentResponse()
  @ApiNotFound(NOT_FOUND)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.courseModulesService.remove(id);
  }
}
