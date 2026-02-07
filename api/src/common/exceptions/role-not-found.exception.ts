import { HttpException, HttpStatus } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum'; // Import your existing enum

export class RoleNotFoundException extends HttpException {
  constructor(role: UserRole) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Role Not Found',
        message: `The role '${role}' does not exist in the database.`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
