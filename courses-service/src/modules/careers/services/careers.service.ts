import { Injectable } from '@nestjs/common';
import { CareersRepository } from '../repositories/careers.repository.js';
import { Career } from '../entities/career.entity.js';
import { CareerDto } from '../dto/career.dto.js';
import { CareerPageDto } from '../dto/career-page.dto.js';
import { CreateCareerDto } from '../dto/create-career.dto.js';
import { UpdateCareerDto } from '../dto/update-career.dto.js';
import {
  CareerNameAlreadyExistsException,
  CareerNotFoundException,
} from '../exceptions/index.js';
import { PaginationQueryDto } from '../../../shared/dto/pagination-query.dto.js';
import { PaginationMetaDto } from '../../../shared/dto/pagination-meta.dto.js';

@Injectable()
export class CareersService {
  constructor(private readonly careersRepository: CareersRepository) {}

  async findAll(query: PaginationQueryDto): Promise<CareerPageDto> {
    const [careers, total] = await this.careersRepository.findPaginated(query);
    return {
      data: careers.map((career) => CareerDto.fromEntity(career)),
      meta: PaginationMetaDto.build(query.page, query.limit, total),
    };
  }

  async findOne(id: string): Promise<CareerDto> {
    return CareerDto.fromEntity(await this.findEntity(id));
  }

  async create(dto: CreateCareerDto): Promise<CareerDto> {
    await this.assertNameIsAvailable(dto.name);

    const career = this.careersRepository.create({
      name: dto.name,
      description: dto.description ?? null,
    });

    return CareerDto.fromEntity(await this.careersRepository.save(career));
  }

  async update(id: string, dto: UpdateCareerDto): Promise<CareerDto> {
    const career = await this.findEntity(id);

    if (dto.name !== undefined && dto.name !== career.name) {
      await this.assertNameIsAvailable(dto.name, id);
      career.name = dto.name;
    }
    if (dto.description !== undefined) career.description = dto.description;

    return CareerDto.fromEntity(await this.careersRepository.save(career));
  }

  async remove(id: string): Promise<void> {
    const career = await this.findEntity(id);
    await this.careersRepository.softRemove(career);
  }

  private async findEntity(id: string): Promise<Career> {
    const career = await this.careersRepository.findById(id);
    if (!career) throw new CareerNotFoundException(id);
    return career;
  }

  private async assertNameIsAvailable(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    if (await this.careersRepository.existsByName(name, excludeId)) {
      throw new CareerNameAlreadyExistsException(name);
    }
  }
}
