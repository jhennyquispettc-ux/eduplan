import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Course } from '../entities/course.entity.js';
import { CourseStatus } from '../enums/course-status.enum.js';
import { Lesson } from '../../lessons/entities/lesson.entity.js';
import { escapeLike } from '../../../shared/utils/escape-like.util.js';

export interface CourseSearchCriteria {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  status?: CourseStatus;
}

export type CourseInsert = Pick<
  Course,
  | 'title'
  | 'description'
  | 'coverImageUrl'
  | 'estimatedHours'
  | 'status'
  | 'categoryId'
>;

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectRepository(Course)
    private readonly repository: Repository<Course>,
  ) {}

  async findPaginated(
    criteria: CourseSearchCriteria,
  ): Promise<[Course[], number]> {
    const { page, limit, search, categoryId, status } = criteria;
    const where: FindOptionsWhere<Course> = {};
    if (search) where.title = ILike(`%${escapeLike(search)}%`);
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    return this.repository.findAndCount({
      where,
      relations: { category: true },
      order: { title: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<Course | null> {
    return this.repository.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async findTreeById(id: string): Promise<Course | null> {
    return this.repository.findOne({
      where: { id },
      relations: { category: true, modules: { lessons: true } },
      order: {
        modules: { createdAt: 'ASC', lessons: { createdAt: 'ASC' } },
      },
    });
  }

  async existsByTitle(title: string, excludeId?: string): Promise<boolean> {
    const where: FindOptionsWhere<Course> = { title: ILike(escapeLike(title)) };
    if (excludeId) where.id = Not(excludeId);
    return this.repository.existsBy(where);
  }

  async countLessons(courseId: string): Promise<number> {
    return this.repository.manager
      .getRepository(Lesson)
      .count({ where: { module: { courseId } } });
  }

  create(data: CourseInsert): Course {
    return this.repository.create(data);
  }

  async save(course: Course): Promise<Course> {
    return this.repository.save(course);
  }

  async softRemoveWithContent(id: string): Promise<void> {
    const course = await this.repository.findOne({
      where: { id },
      relations: { modules: { lessons: true } },
    });
    if (course) await this.repository.softRemove(course);
  }
}
