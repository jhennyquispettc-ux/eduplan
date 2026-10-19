import { Injectable } from '@nestjs/common';
import { CourseModulesRepository } from '../repositories/course-modules.repository.js';
import { CourseModuleEntity } from '../entities/course-module.entity.js';
import { CourseModuleDto } from '../dto/course-module.dto.js';
import { CreateCourseModuleDto } from '../dto/create-course-module.dto.js';
import { UpdateCourseModuleDto } from '../dto/update-course-module.dto.js';
import {
  CourseModuleNotFoundException,
  InvalidCourseIdException,
} from '../exceptions/index.js';
import { CoursesService } from '../../courses/services/courses.service.js';
import { RequestUser } from '../../../shared/auth/request-user.js';

@Injectable()
export class CourseModulesService {
  constructor(
    private readonly courseModulesRepository: CourseModulesRepository,
    private readonly coursesService: CoursesService,
  ) {}

  async findByCourse(
    courseId: string,
    user: RequestUser,
  ): Promise<CourseModuleDto[]> {
    await this.coursesService.assertVisibleTo(courseId, user);
    const modules = await this.courseModulesRepository.findByCourse(courseId);
    return modules.map((module) => CourseModuleDto.fromEntity(module));
  }

  async findOne(id: string, user: RequestUser): Promise<CourseModuleDto> {
    return CourseModuleDto.fromEntity(await this.findVisibleEntity(id, user));
  }

  async create(dto: CreateCourseModuleDto): Promise<CourseModuleDto> {
    if (!(await this.coursesService.exists(dto.courseId))) {
      throw new InvalidCourseIdException(dto.courseId);
    }

    const module = this.courseModulesRepository.create({
      courseId: dto.courseId,
      title: dto.title,
      description: dto.description ?? null,
    });

    return CourseModuleDto.fromEntity(
      await this.courseModulesRepository.save(module),
    );
  }

  async update(
    id: string,
    dto: UpdateCourseModuleDto,
  ): Promise<CourseModuleDto> {
    const module = await this.findEntity(id);
    if (dto.title !== undefined) module.title = dto.title;
    if (dto.description !== undefined) module.description = dto.description;

    return CourseModuleDto.fromEntity(
      await this.courseModulesRepository.save(module),
    );
  }

  async remove(id: string): Promise<void> {
    await this.findEntity(id);
    await this.courseModulesRepository.softRemoveWithLessons(id);
  }

  async exists(id: string): Promise<boolean> {
    return (await this.courseModulesRepository.findById(id)) !== null;
  }

  async assertVisibleTo(id: string, user: RequestUser): Promise<void> {
    await this.findVisibleEntity(id, user);
  }

  async isVisibleTo(id: string, user: RequestUser): Promise<boolean> {
    const module = await this.courseModulesRepository.findById(id);
    return (
      module !== null &&
      (await this.coursesService.isVisibleTo(module.courseId, user))
    );
  }

  private async findVisibleEntity(
    id: string,
    user: RequestUser,
  ): Promise<CourseModuleEntity> {
    const module = await this.courseModulesRepository.findById(id);
    const visible =
      module !== null &&
      (await this.coursesService.isVisibleTo(module.courseId, user));
    if (!visible) throw new CourseModuleNotFoundException(id);
    return module;
  }

  private async findEntity(id: string): Promise<CourseModuleEntity> {
    const module = await this.courseModulesRepository.findById(id);
    if (!module) throw new CourseModuleNotFoundException(id);
    return module;
  }
}
