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
import { CategoriesService } from '../services/categories.service.js';
import { CategoryDto } from '../dto/category.dto.js';
import { CategoryPageDto } from '../dto/category-page.dto.js';
import { CreateCategoryDto } from '../dto/create-category.dto.js';
import { UpdateCategoryDto } from '../dto/update-category.dto.js';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto.js';
import {
  ApiConflict,
  ApiNotFound,
  ApiValidationError,
} from '../../../shared/swagger/api-error.decorators.js';

const NOT_FOUND = {
  code: 'CATEGORY_NOT_FOUND',
  message: 'Category <id> was not found.',
};
const NAME_TAKEN = {
  code: 'CATEGORY_NAME_ALREADY_EXISTS',
  message: 'A category named "Matemáticas" already exists.',
};

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar categorías (paginado, con búsqueda por nombre)',
  })
  @ApiOkResponse({ type: CategoryPageDto })
  @ApiValidationError()
  findAll(@Query() query: PaginationQueryDto): Promise<CategoryPageDto> {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por id' })
  @ApiOkResponse({ type: CategoryDto })
  @ApiNotFound(NOT_FOUND)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryDto> {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una categoría' })
  @ApiCreatedResponse({ type: CategoryDto })
  @ApiValidationError()
  @ApiConflict(NAME_TAKEN)
  create(@Body() dto: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiOkResponse({ type: CategoryDto })
  @ApiValidationError()
  @ApiNotFound(NOT_FOUND)
  @ApiConflict(NAME_TAKEN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría (borrado lógico)' })
  @ApiNoContentResponse()
  @ApiNotFound(NOT_FOUND)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
