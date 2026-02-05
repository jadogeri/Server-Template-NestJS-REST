import { Permission } from "src/modules/permission/entities/permission.entity";
import { Role } from "src/modules/role/entities/role.entity";

// src/auth/interfaces/user-payload.interface.ts
export interface UserPayload {
  userId: number; // From auth table
  email: string; // From auth table
  roles: Role[]; // From user/roles table
  permissions: Permission[]; // From user/permissions table
}
