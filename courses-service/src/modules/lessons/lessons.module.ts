import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity.js';
import { LessonsRepository } from './repositories/lessons.repository.js';
import { LessonsService } from './services/lessons.service.js';
import { LessonsController } from './controllers/lessons.controller.js';
import { CourseModulesModule } from '../course-modules/course-modules.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), CourseModulesModule],
  controllers: [LessonsController],
  providers: [LessonsRepository, LessonsService],
})
export class LessonsModule {}
