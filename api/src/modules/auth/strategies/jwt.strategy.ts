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
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    private readonly logger = new Logger(JwtStrategy.name);  
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
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'), 
      ignoreExpiration: false,
    });
  }


  async validate(jwtPayload: JwtPayloadInterface): Promise<JwtPayloadInterface | null> {
    this.logger.log(`Validating user in JwtStrategy using extrated payload: `);
    this.logger.debug(jwtPayload);

    const jwtUser = await this.authService.verifyJwt(jwtPayload);
    if (!jwtUser) {
      this.logger.warn(`JWT validation failed for email: ${jwtPayload.email}`);
      return null;
    }

    return jwtUser;
  }
}

