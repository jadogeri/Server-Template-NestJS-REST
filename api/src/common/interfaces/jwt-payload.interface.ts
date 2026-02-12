import { UserRole } from "../enums/user-role.enum";

export interface JwtPayload {
  userId: number; // From auth table
  email: string; // From auth table
  roles: UserRole[]; // From user/roles table
  sub?: number; // Standard JWT subject claim, can be user ID or email
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
  permissions?: string[]; // Optional: From user/permissions table
  type?: string; // Optional: To distinguish token types (e.g., 'verification')
  // From user/permissions table
}
