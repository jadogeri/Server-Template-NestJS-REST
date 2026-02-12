import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { AccessControlService } from 'src/core/security/access-control/access-control.service';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from '../auth.service';
import { PermissionString } from 'src/common/types/permission-string.type';
import { UserRole } from 'src/common/enums/user-role.enum';
import { PermissionStringGeneratorUtil } from 'src/common/utils/permission-string.util';
import { JwtPayloadInterface } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {

    private readonly logger = new Logger(RefreshStrategy.name);  
    constructor(
      @Inject(ConfigService) private readonly configService: ConfigService,
      private readonly authService: AuthService,
      private readonly userService: UserService,
      private readonly accessControlService: AccessControlService
    ) {
    super({
      // 1. Where to find the token -- in this case, from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      // 2. Secret key used to sign the token
      secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'), 
      ignoreExpiration: false,
    });
  }


  async validate(jwtPayload: JwtPayloadInterface): Promise<JwtPayloadInterface | null> {
    this.logger.log(`Validating user in JwtStrategy using extrated payload: `);
    this.logger.debug(jwtPayload);
    const { email, userId } = jwtPayload;

    const auth = await this.authService.findByEmail(email);
    if (!auth) {
      return null;
    }
   //  account status checks
    if (!this.accessControlService.isUserActive(auth)) {
      this.logger.warn(`Account for email ${email} is disabled.`);
      return null;

    }

    this.logger.log(`Account for email ${email} is active.`);

    if (!this.accessControlService.isUserVerified(auth)) {
      this.logger.warn(`Account for email ${email} is not verified.`);
      // Optionally, you could trigger a resend of the verification email here
    }
    // Assuming user entity has roles, and roles have permissions
    const user = await this.userService.findByUserId(userId);
    if (!user){
      this.logger.warn(`User not found with id: ${userId}`);
      return null;
    }
    if (auth.user.id !== userId) {
      this.logger.warn(`User ID mismatch: token has ${userId} but auth record has ${auth.user.id}`);
      return null;
    }
    console.log("JwtStrategy: Retrieved user from database:", jwtPayload);

    return jwtPayload;
    
  }
}

