import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity.js';
import { CoursesRepository } from './repositories/courses.repository.js';
import { CoursesService } from './services/courses.service.js';
import { CoursesController } from './controllers/courses.controller.js';
import { CategoriesModule } from '../categories/categories.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), CategoriesModule],
  controllers: [CoursesController],
  providers: [CoursesRepository, CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
