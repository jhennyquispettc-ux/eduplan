import { UserRole } from './user-role.enum.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}
