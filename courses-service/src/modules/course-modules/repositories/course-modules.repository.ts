import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseModuleEntity } from '../entities/course-module.entity.js';

export type CourseModuleInsert = Pick<
  CourseModuleEntity,
  'courseId' | 'title' | 'description'
>;

@Injectable()
export class CourseModulesRepository {
  constructor(
    @InjectRepository(CourseModuleEntity)
    private readonly repository: Repository<CourseModuleEntity>,
  ) {}

  async findByCourse(courseId: string): Promise<CourseModuleEntity[]> {
    return this.repository.find({
      where: { courseId },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<CourseModuleEntity | null> {
    return this.repository.findOneBy({ id });
  }

  create(data: CourseModuleInsert): CourseModuleEntity {
    return this.repository.create(data);
  }

  async save(module: CourseModuleEntity): Promise<CourseModuleEntity> {
    return this.repository.save(module);
  }

  async softRemoveWithLessons(id: string): Promise<void> {
    const module = await this.repository.findOne({
      where: { id },
      relations: { lessons: true },
    });
    if (module) await this.repository.softRemove(module);
  }
}
