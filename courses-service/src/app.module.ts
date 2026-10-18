import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './app/health/health.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { CareersModule } from './modules/careers/careers.module.js';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    HealthModule,
    CategoriesModule,
    CareersModule,
  ],
})
export class AppModule {}
