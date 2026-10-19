import { Module } from '@nestjs/common';
import { CareersClient } from './careers.client.js';

@Module({
  providers: [CareersClient],
  exports: [CareersClient],
})
export class CoursesIntegrationModule {}
