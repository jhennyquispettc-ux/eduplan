import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository.js';
import { PasswordHasherService } from './password-hasher.service.js';
import { User } from '../entities/user.entity.js';
import { UserStatus } from '../enums/user-status.enum.js';
import { UserDto } from '../dto/user.dto.js';
import { UserPageDto } from '../dto/user-page.dto.js';
import { UserQueryDto } from '../dto/user-query.dto.js';
import { NewUserDto } from '../dto/new-user.dto.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { ChangePasswordDto } from '../dto/change-password.dto.js';
import { UserProfileFieldsDto } from '../dto/user-profile-fields.dto.js';
import {
  CannotModifyOwnAccountException,
  EmailAlreadyExistsException,
  InvalidCareerIdException,
  InvalidCurrentPasswordException,
  UserNotFoundException,
} from '../exceptions/index.js';
import { CareersClient } from '../../../integrations/courses/careers.client.js';
import { PaginationMetaDto } from '../../../shared/dto/pagination-meta.dto.js';
import { UserRole } from '../../../shared/auth/user-role.enum.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasherService,
    private readonly careersClient: CareersClient,
  ) {}

  async registerStudent(dto: NewUserDto): Promise<UserDto> {
    return this.createUser(dto, UserRole.STUDENT, UserStatus.PENDING);
  }

  async create(dto: CreateUserDto): Promise<UserDto> {
    return this.createUser(
      dto,
      dto.role ?? UserRole.STUDENT,
      dto.status ?? UserStatus.ACTIVE,
    );
  }

  async findAll(query: UserQueryDto): Promise<UserPageDto> {
    const [users, total] = await this.usersRepository.findPaginated(query);
    return {
      data: users.map((user) => UserDto.fromEntity(user)),
      meta: PaginationMetaDto.build(query.page, query.limit, total),
    };
  }

  async findOne(id: string): Promise<UserDto> {
    return UserDto.fromEntity(await this.findEntity(id));
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    actorId: string | null,
  ): Promise<UserDto> {
    const user = await this.findEntity(id);

    if (dto.role !== undefined && dto.role !== user.role) {
      this.assertNotSelf(id, actorId);
      user.role = dto.role;
    }
    if (dto.email !== undefined && dto.email !== user.email) {
      await this.assertEmailIsAvailable(dto.email, id);
      user.email = dto.email;
    }
    if (dto.password !== undefined) {
      user.passwordHash = await this.passwordHasher.hash(dto.password);
    }
    await this.applyProfile(user, dto);

    return UserDto.fromEntity(await this.usersRepository.save(user));
  }

  async changeStatus(
    id: string,
    status: UserStatus,
    actorId: string | null,
  ): Promise<UserDto> {
    this.assertNotSelf(id, actorId);
    const user = await this.findEntity(id);
    user.status = status;
    return UserDto.fromEntity(await this.usersRepository.save(user));
  }

  async remove(id: string, actorId: string | null): Promise<void> {
    this.assertNotSelf(id, actorId);
    await this.usersRepository.softRemove(await this.findEntity(id));
  }

  async getProfile(userId: string): Promise<UserDto> {
    return this.findOne(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserDto> {
    const user = await this.findEntity(userId);
    await this.applyProfile(user, dto);
    return UserDto.fromEntity(await this.usersRepository.save(user));
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersRepository.findByIdWithPassword(userId);
    if (!user) throw new UserNotFoundException(userId);

    if (
      !(await this.passwordHasher.verify(
        dto.currentPassword,
        user.passwordHash,
      ))
    ) {
      throw new InvalidCurrentPasswordException();
    }

    user.passwordHash = await this.passwordHasher.hash(dto.newPassword);
    await this.usersRepository.save(user);
  }

  async findByCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersRepository.findByEmailWithPassword(email);
    const valid = await this.passwordHasher.verify(
      password,
      user?.passwordHash,
    );
    return valid ? user : null;
  }

  async findEntityOrNull(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  async recordLogin(id: string): Promise<void> {
    await this.usersRepository.updateLastLogin(id, new Date());
  }

  private async createUser(
    dto: NewUserDto,
    role: UserRole,
    status: UserStatus,
  ): Promise<UserDto> {
    await this.assertEmailIsAvailable(dto.email);
    if (dto.careerId) await this.assertCareerExists(dto.careerId);

    const user = this.usersRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordHash: await this.passwordHasher.hash(dto.password),
      phone: dto.phone,
      school: dto.school,
      careerId: dto.careerId ?? null,
      role,
      status,
    });

    return UserDto.fromEntity(await this.usersRepository.save(user));
  }

  private async applyProfile(
    user: User,
    dto: Partial<UserProfileFieldsDto>,
  ): Promise<void> {
    if (dto.firstName !== undefined) user.firstName = dto.firstName;
    if (dto.lastName !== undefined) user.lastName = dto.lastName;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.school !== undefined) user.school = dto.school;
    if (dto.careerId !== undefined && dto.careerId !== user.careerId) {
      if (dto.careerId) await this.assertCareerExists(dto.careerId);
      user.careerId = dto.careerId;
    }
  }

  private async findEntity(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new UserNotFoundException(id);
    return user;
  }

  private assertNotSelf(targetId: string, actorId: string | null): void {
    if (targetId === actorId) throw new CannotModifyOwnAccountException();
  }

  private async assertEmailIsAvailable(
    email: string,
    excludeId?: string,
  ): Promise<void> {
    if (await this.usersRepository.existsByEmail(email, excludeId)) {
      throw new EmailAlreadyExistsException(email);
    }
  }

  private async assertCareerExists(careerId: string): Promise<void> {
    if (!(await this.careersClient.exists(careerId))) {
      throw new InvalidCareerIdException(careerId);
    }
  }
}
