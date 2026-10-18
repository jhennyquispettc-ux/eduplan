import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Career } from '../entities/career.entity.js';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto.js';
import { escapeLike } from '../../../shared/utils/escape-like.util.js';

@Injectable()
export class CareersRepository {
  constructor(
    @InjectRepository(Career)
    private readonly repository: Repository<Career>,
  ) {}

  async findPaginated({
    page,
    limit,
    search,
  }: PaginationQueryDto): Promise<[Career[], number]> {
    const where: FindOptionsWhere<Career> = {};
    if (search) where.name = ILike(`%${escapeLike(search)}%`);

    return this.repository.findAndCount({
      where,
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<Career | null> {
    return this.repository.findOneBy({ id });
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const where: FindOptionsWhere<Career> = { name: ILike(escapeLike(name)) };
    if (excludeId) where.id = Not(excludeId);
    return this.repository.existsBy(where);
  }

  create(data: Pick<Career, 'name' | 'description'>): Career {
    return this.repository.create(data);
  }

  async save(career: Career): Promise<Career> {
    return this.repository.save(career);
  }

  async softRemove(career: Career): Promise<void> {
    await this.repository.softRemove(career);
  }
}
