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
import { LessonsService } from '../services/lessons.service.js';
import { LessonDto } from '../dto/lesson.dto.js';
import { LessonQueryDto } from '../dto/lesson-query.dto.js';
import { CreateLessonDto } from '../dto/create-lesson.dto.js';
import { UpdateLessonDto } from '../dto/update-lesson.dto.js';
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
  code: 'LESSON_NOT_FOUND',
  message: 'Lesson <id> was not found.',
};
const INVALID_CONTENT = {
  code: 'INVALID_LESSON_CONTENT',
  message: 'VIDEO lessons require a videoUrl.',
};

@ApiTags('Lessons')
@ApiUserHeaders()
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar las lecciones de un módulo' })
  @ApiOkResponse({ type: [LessonDto] })
  @ApiValidationError()
  @ApiNotFound({
    code: 'MODULE_NOT_FOUND',
    message: 'Module <id> was not found.',
  })
  findByModule(
    @Query() query: LessonQueryDto,
    @CurrentUser() user: RequestUser,
  ): Promise<LessonDto[]> {
    return this.lessonsService.findByModule(query.moduleId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una lección por id' })
  @ApiOkResponse({ type: LessonDto })
  @ApiNotFound(NOT_FOUND)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: RequestUser,
  ): Promise<LessonDto> {
    return this.lessonsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una lección de texto o de video dentro de un módulo',
  })
  @ApiCreatedResponse({ type: LessonDto })
  @ApiValidationError(INVALID_CONTENT, {
    code: 'INVALID_MODULE_ID',
    message: 'Module <id> does not exist.',
  })
  create(@Body() dto: CreateLessonDto): Promise<LessonDto> {
    return this.lessonsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una lección' })
  @ApiOkResponse({ type: LessonDto })
  @ApiValidationError(INVALID_CONTENT)
  @ApiNotFound(NOT_FOUND)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLessonDto,
  ): Promise<LessonDto> {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una lección (borrado lógico)' })
  @ApiNoContentResponse()
  @ApiNotFound(NOT_FOUND)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.lessonsService.remove(id);
  }
}
