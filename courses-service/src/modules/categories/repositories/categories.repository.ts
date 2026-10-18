import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Category } from '../entities/category.entity.js';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto.js';
import { escapeLike } from '../../../shared/utils/escape-like.util.js';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async findPaginated({
    page,
    limit,
    search,
  }: PaginationQueryDto): Promise<[Category[], number]> {
    const where: FindOptionsWhere<Category> = {};
    if (search) where.name = ILike(`%${escapeLike(search)}%`);

    return this.repository.findAndCount({
      where,
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.repository.findOneBy({ id });
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const where: FindOptionsWhere<Category> = { name: ILike(escapeLike(name)) };
    if (excludeId) where.id = Not(excludeId);
    return this.repository.existsBy(where);
  }

  create(data: Pick<Category, 'name' | 'description'>): Category {
    return this.repository.create(data);
  }

  async save(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  async softRemove(category: Category): Promise<void> {
    await this.repository.softRemove(category);
  }
}
