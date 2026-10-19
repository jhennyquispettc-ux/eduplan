import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity.js';

export type RefreshTokenInsert = Pick<
  RefreshToken,
  'userId' | 'tokenHash' | 'expiresAt'
>;

@Injectable()
export class RefreshTokensRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async findByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.repository.findOneBy({ tokenHash });
  }

  async create(data: RefreshTokenInsert): Promise<void> {
    await this.repository.insert(data);
  }

  async rotate(currentId: string, next: RefreshTokenInsert): Promise<boolean> {
    const nextId = randomUUID();

    return this.repository.manager.transaction(async (manager) => {
      const result = await manager.update(
        RefreshToken,
        { id: currentId, revokedAt: IsNull() },
        { revokedAt: new Date(), replacedById: nextId },
      );
      if (result.affected !== 1) return false;

      await manager.insert(RefreshToken, { id: nextId, ...next });
      return true;
    });
  }

  async revoke(id: string): Promise<void> {
    await this.repository.update(
      { id, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.repository.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );
  }
}
