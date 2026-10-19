import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './app/health/health.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { CareersModule } from './modules/careers/careers.module.js';
import { CoursesModule } from './modules/courses/courses.module.js';
import { CourseModulesModule } from './modules/course-modules/course-modules.module.js';
import { LessonsModule } from './modules/lessons/lessons.module.js';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    HealthModule,
    CategoriesModule,
    CareersModule,
    CoursesModule,
    CourseModulesModule,
    LessonsModule,
  ],
})
export class AppModule {}
