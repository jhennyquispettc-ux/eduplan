import { Injectable, OnModuleInit } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { AuthConfig } from '../../../config/services/auth.config.js';

@Injectable()
export class PasswordHasherService implements OnModuleInit {
  private dummyHash: string;

  constructor(private readonly authConfig: AuthConfig) {}

  async onModuleInit(): Promise<void> {
    this.dummyHash = await this.hash('timing-attack-protection');
  }

  hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.authConfig.bcryptRounds);
  }

  async verify(
    plain: string,
    hash: string | null | undefined,
  ): Promise<boolean> {
    const matches = await bcrypt.compare(plain, hash ?? this.dummyHash);
    return Boolean(hash) && matches;
  }
}
