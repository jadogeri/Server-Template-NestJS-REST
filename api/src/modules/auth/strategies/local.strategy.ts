import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as PassportLocalStrategy} from 'passport-local';
import { AuthService } from '../auth.service';
import { UserPayload } from '../../../common/interfaces/user-payload.interface';
import { Permission } from '../../../modules/permission/entities/permission.entity';
import { AccessControlService } from 'src/core/security/access-control/access-control.service';
import { UserService } from '../../../modules/user/user.service';
import { Role } from '../../../modules/role/entities/role.entity';
import { Strategy } from '../../../common/decorators/strategy.decorator';

@Strategy() // Use the custom @Strategy decorator
export class LocalStrategy extends PassportStrategy(PassportLocalStrategy, 'local') {
    private readonly permissionSet = new Set<Permission>();
    private readonly roleSet = new Set<Role>();
    private readonly logger = new Logger(LocalStrategy.name);  
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly accessControlService: AccessControlService,

  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserPayload | null> {
    console.log('Validating user in LocalStrategy with email:', email);
    console.log('Password received for validation:', password );
    const auth = await this.authService.verifyUser(email, password);
    if (!auth) {
      console.log('User validation failed for email:', email);
      return null;
    } 
   //  account status checks
    if (this.accessControlService.isUserActive(auth)) {
      this.logger.warn(`Account for email ${email} is disabled.`);
      return null;

    }

    if (!this.accessControlService.isUserVerified(auth)) {
      this.logger.warn(`Account for email ${email} is not verified.`);
      // Optionally, you could trigger a resend of the verification email here
    }
    // Assuming user entity has roles, and roles have permissions
    const user = await this.userService.findByUserId(auth.user.id);
    if (!user) {
      console.log('User not found for email:', email);
      return null;
    }

    user.roles.forEach(role => {
      role.permissions.forEach(permission => {
        this.permissionSet.add(permission); // Add permission to set
      });
    });

    user.roles.forEach(role => {
      this.roleSet.add(role); // Add role to set
    });

    const uniquePermissions = Array.from(this.permissionSet);
    const uniqueRoles = Array.from(this.roleSet);

    console.log(`User ${email} has roles:`, uniqueRoles);
    console.log(`User ${email} has permissions:`, uniquePermissions);
    const userPayload: UserPayload = {
      userId: user.id,
      email: email,
      roles: uniqueRoles,
      permissions: uniquePermissions,
    };
    return userPayload;
    
  }
}

