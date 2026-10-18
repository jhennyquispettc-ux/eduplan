import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from './entities/career.entity.js';
import { CareersRepository } from './repositories/careers.repository.js';
import { CareersService } from './services/careers.service.js';
import { CareersController } from './controllers/careers.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Career])],
  controllers: [CareersController],
  providers: [CareersRepository, CareersService],
  exports: [CareersService],
})
export class CareersModule {}
