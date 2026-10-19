import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../entities/course.entity.js';
import { CourseDto } from './course.dto.js';
import { CourseModuleDto } from '../../course-modules/dto/course-module.dto.js';
import { LessonDto } from '../../lessons/dto/lesson.dto.js';

export class CourseModuleWithLessonsDto extends CourseModuleDto {
  @ApiProperty({ type: [LessonDto] })
  lessons: LessonDto[];
}

export class CourseDetailDto extends CourseDto {
  @ApiProperty({ type: [CourseModuleWithLessonsDto] })
  modules: CourseModuleWithLessonsDto[];

  static fromEntity(entity: Course): CourseDetailDto {
    const dto = CourseDto.fill(new CourseDetailDto(), entity);
    dto.modules = entity.modules.map((module) => {
      const moduleDto = Object.assign(
        new CourseModuleWithLessonsDto(),
        CourseModuleDto.fromEntity(module),
      );
      moduleDto.lessons = module.lessons.map((lesson) =>
        LessonDto.fromEntity(lesson),
      );
      return moduleDto;
    });
    return dto;
  }
}
