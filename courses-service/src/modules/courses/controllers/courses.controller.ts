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
import { CoursesService } from '../services/courses.service.js';
import { CourseDto } from '../dto/course.dto.js';
import { CourseDetailDto } from '../dto/course-detail.dto.js';
import { CourseExportDto } from '../dto/course-export.dto.js';
import { CoursePageDto } from '../dto/course-page.dto.js';
import { CourseQueryDto } from '../dto/course-query.dto.js';
import { CreateCourseDto } from '../dto/create-course.dto.js';
import { UpdateCourseDto } from '../dto/update-course.dto.js';
import { UpdateCourseStatusDto } from '../dto/update-course-status.dto.js';
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
  code: 'COURSE_NOT_FOUND',
  message: 'Course <id> was not found.',
};
const TITLE_TAKEN = {
  code: 'COURSE_TITLE_ALREADY_EXISTS',
  message: 'A course titled "Matemática para ingeniería" already exists.',
};
const INVALID_CATEGORY = {
  code: 'INVALID_CATEGORY_ID',
  message: 'Category <id> does not exist.',
};

@ApiTags('Courses')
@ApiUserHeaders()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar cursos (paginado, filtro por categoría y búsqueda)',
    description: 'Los estudiantes solo reciben cursos PUBLISHED.',
  })
  @ApiOkResponse({ type: CoursePageDto })
  @ApiValidationError()
  findAll(
    @Query() query: CourseQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<CoursePageDto> {
    return this.coursesService.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Detalle del curso con sus módulos y lecciones',
  })
  @ApiOkResponse({ type: CourseDetailDto })
  @ApiNotFound(NOT_FOUND)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<CourseDetailDto> {
    return this.coursesService.findOne(id, user);
  }

  @Get(':id/export')
  @ApiOperation({
    summary: 'Exportar el curso completo para uso sin conexión',
  })
  @ApiOkResponse({ type: CourseExportDto })
  @ApiNotFound(NOT_FOUND)
  export(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<CourseExportDto> {
    return this.coursesService.export(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un curso (inicia en DRAFT)' })
  @ApiCreatedResponse({ type: CourseDto })
  @ApiValidationError(INVALID_CATEGORY)
  @ApiConflict(TITLE_TAKEN)
  create(@Body() dto: CreateCourseDto): Promise<CourseDto> {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un curso' })
  @ApiOkResponse({ type: CourseDto })
  @ApiValidationError(INVALID_CATEGORY)
  @ApiNotFound(NOT_FOUND)
  @ApiConflict(TITLE_TAKEN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
  ): Promise<CourseDto> {
    return this.coursesService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Publicar o despublicar un curso',
    description: 'Para publicar, el curso debe tener al menos una lección.',
  })
  @ApiOkResponse({ type: CourseDto })
  @ApiValidationError()
  @ApiNotFound(NOT_FOUND)
  @ApiUnprocessable({
    code: 'COURSE_NOT_PUBLISHABLE',
    message:
      'Course <id> needs at least one lesson before it can be published.',
  })
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseStatusDto,
  ): Promise<CourseDto> {
    return this.coursesService.changeStatus(id, dto.status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un curso con sus módulos y lecciones (borrado lógico)',
  })
  @ApiNoContentResponse()
  @ApiNotFound(NOT_FOUND)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.coursesService.remove(id);
  }
}
