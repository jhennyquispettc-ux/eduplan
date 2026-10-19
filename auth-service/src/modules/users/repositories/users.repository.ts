import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { UserStatus } from '../enums/user-status.enum.js';
import { UserRole } from '../../../shared/auth/user-role.enum.js';
import { escapeLike } from '../../../shared/utils/escape-like.util.js';

export interface UserSearchCriteria {
  page: number;
  limit: number;
  search?: string;
  status?: UserStatus;
  role?: UserRole;
}

export type UserInsert = Pick<
  User,
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'passwordHash'
  | 'phone'
  | 'school'
  | 'careerId'
  | 'role'
  | 'status'
>;

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findPaginated(criteria: UserSearchCriteria): Promise<[User[], number]> {
    const { page, limit, search, status, role } = criteria;
    const filters: FindOptionsWhere<User> = {};
    if (status) filters.status = status;
    if (role) filters.role = role;

    const pattern = search ? ILike(`%${escapeLike(search)}%`) : undefined;
    const where = pattern
      ? [
          { ...filters, firstName: pattern },
          { ...filters, lastName: pattern },
          { ...filters, email: pattern },
        ]
      : filters;

    return this.repository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id })
      .getOne();
  }

  async existsByEmail(email: string, excludeId?: string): Promise<boolean> {
    const where: FindOptionsWhere<User> = { email };
    if (excludeId) where.id = Not(excludeId);
    return this.repository.existsBy(where);
  }

  create(data: UserInsert): User {
    return this.repository.create(data);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async updateLastLogin(id: string, date: Date): Promise<void> {
    await this.repository.update({ id }, { lastLoginAt: date });
  }

  async softRemove(user: User): Promise<void> {
    await this.repository.softRemove(user);
  }
}
