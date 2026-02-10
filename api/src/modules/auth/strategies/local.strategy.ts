import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserPayload } from '../../../common/interfaces/user-payload.interface';
import { Permission } from '../../../modules/permission/entities/permission.entity';
import { AccessControlService } from 'src/core/security/access-control/access-control.service';
import { UserService } from '../../../modules/user/user.service';
import { Role } from '../../../modules/role/entities/role.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { PermissionString } from 'src/common/types/permission-string.type';
import { PermissionStringGeneratorUtil } from 'src/common/utils/permission-string.util';

@Injectable() // Use the custom @Strategy decorator
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    private readonly permissionSet = new Set<PermissionString>();
    private readonly roleSet = new Set<UserRole>();
    private readonly logger = new Logger(LocalStrategy.name);  
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly accessControlService: AccessControlService,

  ) {
    super({
      usernameField: 'email',
      //  passReqToCallback: true, 
    });
  }


  async validate(email: string, password: string): Promise<UserPayload | null> {
    // console.log('Validating user in LocalStrategy with email:', email);
    // console.log('Password received for validation:', password );
    const foundUser = await this.authService.verifyUser(email, password);
    if (!foundUser) {
      console.log('User validation failed for email:', email);
      return null;
    } 
    const auth = await this.authService.findByEmail(email);
    if (!auth) {
      //console.log('Auth record not found for email:', email);
      return null;
    }

   //  account status checks

    if (!this.accessControlService.isUserActive(auth)) {
      this.logger.warn(`Account for email ${email} is disabled.`);
      return null;

    }

    console.log(`Account for email ${email} is active.`);

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

// 2. Implementation (No 'as' needed!)
const uniquePermissions: PermissionString[] = [
  ...new Set(
    user.roles.flatMap(role => 
      role.permissions.map(p => PermissionStringGeneratorUtil.generate(p.resource, p.action))
    )
  )
];

// 2. Implementation (No 'as' needed!)
const uniqueRoles: UserRole[] = [
  ...new Set(
    user.roles.flatMap(role => 
      role.name)
    )  
];

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

