import { Injectable } from '@nestjs/common';
import { CoursesRepository } from '../repositories/courses.repository.js';
import { Course } from '../entities/course.entity.js';
import { CourseStatus } from '../enums/course-status.enum.js';
import { CourseDto } from '../dto/course.dto.js';
import { CourseDetailDto } from '../dto/course-detail.dto.js';
import { CourseExportDto } from '../dto/course-export.dto.js';
import { CoursePageDto } from '../dto/course-page.dto.js';
import { CourseQueryDto } from '../dto/course-query.dto.js';
import { CreateCourseDto } from '../dto/create-course.dto.js';
import { UpdateCourseDto } from '../dto/update-course.dto.js';
import {
  CourseNotFoundException,
  CourseNotPublishableException,
  CourseTitleAlreadyExistsException,
  InvalidCategoryIdException,
} from '../exceptions/index.js';
import { CategoriesService } from '../../categories/services/categories.service.js';
import { PaginationMetaDto } from '../../../shared/dto/pagination-meta.dto.js';
import { isAdmin, RequestUser } from '../../../shared/auth/request-user.js';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(
    query: CourseQueryDto,
    user: RequestUser,
  ): Promise<CoursePageDto> {
    const status = isAdmin(user) ? query.status : CourseStatus.PUBLISHED;
    const [courses, total] = await this.coursesRepository.findPaginated({
      ...query,
      status,
    });

    return {
      data: courses.map((course) => CourseDto.fromEntity(course)),
      meta: PaginationMetaDto.build(query.page, query.limit, total),
    };
  }

  async findOne(id: string, user: RequestUser): Promise<CourseDetailDto> {
    const course = await this.coursesRepository.findTreeById(id);
    this.assertVisible(id, course, user);
    return CourseDetailDto.fromEntity(course);
  }

  async export(id: string, user: RequestUser): Promise<CourseExportDto> {
    return CourseExportDto.fromDetail(await this.findOne(id, user));
  }

  async create(dto: CreateCourseDto): Promise<CourseDto> {
    await this.assertTitleIsAvailable(dto.title);
    await this.assertCategoryExists(dto.categoryId);

    const course = this.coursesRepository.create({
      title: dto.title,
      description: dto.description,
      coverImageUrl: dto.coverImageUrl ?? null,
      estimatedHours: dto.estimatedHours ?? null,
      status: CourseStatus.DRAFT,
      categoryId: dto.categoryId,
    });
    const saved = await this.coursesRepository.save(course);

    return CourseDto.fromEntity(await this.findEntity(saved.id));
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseDto> {
    const course = await this.findEntity(id);

    if (dto.title !== undefined && dto.title !== course.title) {
      await this.assertTitleIsAvailable(dto.title, id);
      course.title = dto.title;
    }
    if (dto.categoryId !== undefined && dto.categoryId !== course.categoryId) {
      await this.assertCategoryExists(dto.categoryId);
      course.categoryId = dto.categoryId;
    }
    if (dto.description !== undefined) course.description = dto.description;
    if (dto.coverImageUrl !== undefined)
      course.coverImageUrl = dto.coverImageUrl;
    if (dto.estimatedHours !== undefined)
      course.estimatedHours = dto.estimatedHours;

    await this.coursesRepository.save(course);
    return CourseDto.fromEntity(await this.findEntity(id));
  }

  async changeStatus(id: string, status: CourseStatus): Promise<CourseDto> {
    const course = await this.findEntity(id);

    if (
      status === CourseStatus.PUBLISHED &&
      (await this.coursesRepository.countLessons(id)) === 0
    ) {
      throw new CourseNotPublishableException(id);
    }

    course.status = status;
    await this.coursesRepository.save(course);
    return CourseDto.fromEntity(course);
  }

  async remove(id: string): Promise<void> {
    await this.findEntity(id);
    await this.coursesRepository.softRemoveWithContent(id);
  }

  async exists(id: string): Promise<boolean> {
    return (await this.coursesRepository.findById(id)) !== null;
  }

  async assertVisibleTo(id: string, user: RequestUser): Promise<void> {
    const course = await this.coursesRepository.findById(id);
    this.assertVisible(id, course, user);
  }

  async isVisibleTo(id: string, user: RequestUser): Promise<boolean> {
    const course = await this.coursesRepository.findById(id);
    return this.canSee(course, user);
  }

  private assertVisible(
    id: string,
    course: Course | null,
    user: RequestUser,
  ): asserts course is Course {
    if (!this.canSee(course, user)) throw new CourseNotFoundException(id);
  }

  private canSee(course: Course | null, user: RequestUser): course is Course {
    if (!course) return false;
    return isAdmin(user) || course.status === CourseStatus.PUBLISHED;
  }

  private async findEntity(id: string): Promise<Course> {
    const course = await this.coursesRepository.findById(id);
    if (!course) throw new CourseNotFoundException(id);
    return course;
  }

  private async assertTitleIsAvailable(
    title: string,
    excludeId?: string,
  ): Promise<void> {
    if (await this.coursesRepository.existsByTitle(title, excludeId)) {
      throw new CourseTitleAlreadyExistsException(title);
    }
  }

  private async assertCategoryExists(categoryId: string): Promise<void> {
    if (!(await this.categoriesService.exists(categoryId))) {
      throw new InvalidCategoryIdException(categoryId);
    }
  }
}
