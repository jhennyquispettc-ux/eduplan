import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository.js';
import { Category } from '../entities/category.entity.js';
import { CategoryDto } from '../dto/category.dto.js';
import { CategoryPageDto } from '../dto/category-page.dto.js';
import { CreateCategoryDto } from '../dto/create-category.dto.js';
import { UpdateCategoryDto } from '../dto/update-category.dto.js';
import {
  CategoryNameAlreadyExistsException,
  CategoryNotFoundException,
} from '../exceptions/index.js';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto.js';
import { PaginationMetaDto } from '../../../shared/dto/pagination-meta.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll(query: PaginationQueryDto): Promise<CategoryPageDto> {
    const [categories, total] =
      await this.categoriesRepository.findPaginated(query);
    return {
      data: categories.map((category) => CategoryDto.fromEntity(category)),
      meta: PaginationMetaDto.build(query.page, query.limit, total),
    };
  }

  async findOne(id: string): Promise<CategoryDto> {
    return CategoryDto.fromEntity(await this.findEntity(id));
  }

  async create(dto: CreateCategoryDto): Promise<CategoryDto> {
    await this.assertNameIsAvailable(dto.name);

    const category = this.categoriesRepository.create({
      name: dto.name,
      description: dto.description ?? null,
    });

    return CategoryDto.fromEntity(
      await this.categoriesRepository.save(category),
    );
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.findEntity(id);

    if (dto.name !== undefined && dto.name !== category.name) {
      await this.assertNameIsAvailable(dto.name, id);
      category.name = dto.name;
    }
    if (dto.description !== undefined) category.description = dto.description;

    return CategoryDto.fromEntity(
      await this.categoriesRepository.save(category),
    );
  }

  async remove(id: string): Promise<void> {
    const category = await this.findEntity(id);
    await this.categoriesRepository.softRemove(category);
  }

  private async findEntity(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new CategoryNotFoundException(id);
    return category;
  }

  private async assertNameIsAvailable(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    if (await this.categoriesRepository.existsByName(name, excludeId)) {
      throw new CategoryNameAlreadyExistsException(name);
    }
  }
}
