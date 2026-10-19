import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity.js';

@Injectable()
export class LessonsRepository {
  constructor(
    @InjectRepository(Lesson)
    private readonly repository: Repository<Lesson>,
  ) {}

  async findByModule(moduleId: string): Promise<Lesson[]> {
    return this.repository.find({
      where: { moduleId },
      order: { createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<Lesson | null> {
    return this.repository.findOneBy({ id });
  }

  create(moduleId: string): Lesson {
    return this.repository.create({ moduleId });
  }

  async save(lesson: Lesson): Promise<Lesson> {
    return this.repository.save(lesson);
  }

  async softRemove(lesson: Lesson): Promise<void> {
    await this.repository.softRemove(lesson);
  }
}
