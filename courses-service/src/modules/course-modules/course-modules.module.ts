import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModuleEntity } from './entities/course-module.entity.js';
import { CourseModulesRepository } from './repositories/course-modules.repository.js';
import { CourseModulesService } from './services/course-modules.service.js';
import { CourseModulesController } from './controllers/course-modules.controller.js';
import { CoursesModule } from '../courses/courses.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([CourseModuleEntity]), CoursesModule],
  controllers: [CourseModulesController],
  providers: [CourseModulesRepository, CourseModulesService],
  exports: [CourseModulesService],
})
export class CourseModulesModule {}
