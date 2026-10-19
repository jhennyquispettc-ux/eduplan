import 'dotenv/config';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source.js';
import { User } from '../../modules/users/entities/user.entity.js';
import { UserStatus } from '../../modules/users/enums/user-status.enum.js';
import { UserRole } from '../../shared/auth/user-role.enum.js';

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

async function seedAdmin(): Promise<void> {
  const email = requireEnv('SEED_ADMIN_EMAIL').toLowerCase();
  const password = requireEnv('SEED_ADMIN_PASSWORD');
  const rounds = Number(process.env.BCRYPT_ROUNDS ?? 12);

  if (password.length < 8 || !/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    throw new Error(
      'SEED_ADMIN_PASSWORD needs at least 8 characters, one letter and one number',
    );
  }

  await AppDataSource.initialize();
  const users = AppDataSource.getRepository(User);

  try {
    if (await users.existsBy({ email })) {
      console.log(`Admin ${email} already exists. Nothing to do.`);
      return;
    }

    await users.insert({
      firstName: process.env.SEED_ADMIN_FIRST_NAME ?? 'Admin',
      lastName: process.env.SEED_ADMIN_LAST_NAME ?? 'EDUPLAN',
      email,
      passwordHash: await bcrypt.hash(password, rounds),
      phone: process.env.SEED_ADMIN_PHONE ?? '+591 00000000',
      school: 'EDUPLAN',
      careerId: null,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    });
    console.log(`Admin ${email} created.`);
  } finally {
    await AppDataSource.destroy();
  }
}

seedAdmin().catch((error: Error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
});
