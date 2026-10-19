import { Injectable } from '@nestjs/common';
import { LessonsRepository } from '../repositories/lessons.repository.js';
import { Lesson } from '../entities/lesson.entity.js';
import { LessonType } from '../enums/lesson-type.enum.js';
import { LessonDto } from '../dto/lesson.dto.js';
import { CreateLessonDto } from '../dto/create-lesson.dto.js';
import { UpdateLessonDto } from '../dto/update-lesson.dto.js';
import {
  InvalidLessonContentException,
  InvalidModuleIdException,
  LessonNotFoundException,
} from '../exceptions/index.js';
import { CourseModulesService } from '../../course-modules/services/course-modules.service.js';
import { RequestUser } from '../../../shared/auth/request-user.js';

interface LessonContentChanges {
  type?: LessonType;
  content?: string | null;
  videoUrl?: string | null;
}

@Injectable()
export class LessonsService {
  constructor(
    private readonly lessonsRepository: LessonsRepository,
    private readonly courseModulesService: CourseModulesService,
  ) {}

  async findByModule(
    moduleId: string,
    user: RequestUser,
  ): Promise<LessonDto[]> {
    await this.courseModulesService.assertVisibleTo(moduleId, user);
    const lessons = await this.lessonsRepository.findByModule(moduleId);
    return lessons.map((lesson) => LessonDto.fromEntity(lesson));
  }

  async findOne(id: string, user: RequestUser): Promise<LessonDto> {
    const lesson = await this.lessonsRepository.findById(id);
    const visible =
      lesson !== null &&
      (await this.courseModulesService.isVisibleTo(lesson.moduleId, user));
    if (!visible) throw new LessonNotFoundException(id);
    return LessonDto.fromEntity(lesson);
  }

  async create(dto: CreateLessonDto): Promise<LessonDto> {
    if (!(await this.courseModulesService.exists(dto.moduleId))) {
      throw new InvalidModuleIdException(dto.moduleId);
    }

    const lesson = this.lessonsRepository.create(dto.moduleId);
    lesson.title = dto.title;
    this.applyContent(lesson, dto);

    return LessonDto.fromEntity(await this.lessonsRepository.save(lesson));
  }

  async update(id: string, dto: UpdateLessonDto): Promise<LessonDto> {
    const lesson = await this.findEntity(id);
    if (dto.title !== undefined) lesson.title = dto.title;
    this.applyContent(lesson, dto);

    return LessonDto.fromEntity(await this.lessonsRepository.save(lesson));
  }

  async remove(id: string): Promise<void> {
    await this.lessonsRepository.softRemove(await this.findEntity(id));
  }

  private applyContent(lesson: Lesson, changes: LessonContentChanges): void {
    const type = changes.type ?? lesson.type;
    const content =
      changes.content !== undefined ? changes.content : lesson.content;
    let videoUrl =
      changes.videoUrl !== undefined ? changes.videoUrl : lesson.videoUrl;

    if (type === LessonType.TEXT) {
      if (typeof changes.videoUrl === 'string') {
        throw new InvalidLessonContentException(
          'TEXT lessons cannot have a videoUrl.',
        );
      }
      if (!content) {
        throw new InvalidLessonContentException(
          'TEXT lessons require content.',
        );
      }
      videoUrl = null;
    }

    if (type === LessonType.VIDEO && !videoUrl) {
      throw new InvalidLessonContentException(
        'VIDEO lessons require a videoUrl.',
      );
    }

    lesson.type = type;
    lesson.content = content ?? null;
    lesson.videoUrl = videoUrl ?? null;
  }

  private async findEntity(id: string): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findById(id);
    if (!lesson) throw new LessonNotFoundException(id);
    return lesson;
  }
}
