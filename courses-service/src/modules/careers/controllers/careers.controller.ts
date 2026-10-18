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
import { CareersService } from '../services/careers.service.js';
import { CareerDto } from '../dto/career.dto.js';
import { CareerPageDto } from '../dto/career-page.dto.js';
import { CreateCareerDto } from '../dto/create-career.dto.js';
import { UpdateCareerDto } from '../dto/update-career.dto.js';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto.js';
import {
  ApiConflict,
  ApiNotFound,
  ApiValidationError,
} from '../../../shared/swagger/api-error.decorators.js';

const NOT_FOUND = {
  code: 'CAREER_NOT_FOUND',
  message: 'Career <id> was not found.',
};
const NAME_TAKEN = {
  code: 'CAREER_NAME_ALREADY_EXISTS',
  message: 'A career named "Medicina" already exists.',
};

@ApiTags('Careers')
@Controller('careers')
export class CareersController {
  constructor(private readonly careersService: CareersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar carreras (paginado, con búsqueda por nombre)',
  })
  @ApiOkResponse({ type: CareerPageDto })
  @ApiValidationError()
  findAll(@Query() query: PaginationQueryDto): Promise<CareerPageDto> {
    return this.careersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una carrera por id' })
  @ApiOkResponse({ type: CareerDto })
  @ApiNotFound(NOT_FOUND)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CareerDto> {
    return this.careersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una carrera' })
  @ApiCreatedResponse({ type: CareerDto })
  @ApiValidationError()
  @ApiConflict(NAME_TAKEN)
  create(@Body() dto: CreateCareerDto): Promise<CareerDto> {
    return this.careersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una carrera' })
  @ApiOkResponse({ type: CareerDto })
  @ApiValidationError()
  @ApiNotFound(NOT_FOUND)
  @ApiConflict(NAME_TAKEN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCareerDto,
  ): Promise<CareerDto> {
    return this.careersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una carrera (borrado lógico)' })
  @ApiNoContentResponse()
  @ApiNotFound(NOT_FOUND)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.careersService.remove(id);
  }
}
