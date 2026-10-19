import { UserRole } from '../../shared/auth/user-role.enum.js';

export const PUBLIC = 'PUBLIC';
export const AUTHENTICATED = 'AUTHENTICATED';

export type AccessPolicy =
  typeof PUBLIC | typeof AUTHENTICATED | readonly UserRole[];

export const ADMIN_ONLY: readonly UserRole[] = [UserRole.ADMIN];
