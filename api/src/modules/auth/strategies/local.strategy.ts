import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserPayload } from '../../../common/interfaces/user-payload.interface';
import { Permission } from '../../../modules/permission/entities/permission.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<void> {
  //Promise<UserPayload | null> {
    /*console.log('Validating user in LocalStrategy with email:', email);
    console.log('Password received for validation:', password );
    const user = await this.authService.verifyUser(email, password);
    if (!user) {
      console.log('User validation failed for email:', email);
      return null;
    } 
    // Assuming user entity has roles, and roles have permissions
const permissionSet = new Set<Permission>();

    user.roles.forEach(role => {
      role.permissions.forEach(permission => {
        permissionSet.add(permission); // Add permission to set
      });
    });

    const uniquePermissions = Array.from(permissionSet);

    const userPayload: UserPayload = {
      userId: user.id,
      email: email,
      roles: user.roles,
      permissions: uniquePermissions,
    };
    return userPayload;
    */
  }
}