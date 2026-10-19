import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { UsersRepository } from './repositories/users.repository.js';
import { PasswordHasherService } from './services/password-hasher.service.js';
import { UsersService } from './services/users.service.js';
import { ProfileController } from './controllers/profile.controller.js';
import { UsersController } from './controllers/users.controller.js';
import { CoursesIntegrationModule } from '../../integrations/courses/courses-integration.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CoursesIntegrationModule],
  controllers: [ProfileController, UsersController],
  providers: [UsersRepository, PasswordHasherService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
