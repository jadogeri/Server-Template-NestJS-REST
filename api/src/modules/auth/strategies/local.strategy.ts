import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserPayload } from '../../../common/interfaces/user-payload.interface';

@Injectable() // Use the custom @Strategy decorator
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
 
  constructor(
    private readonly authService: AuthService,

  ) {
    super({
      usernameField: 'email',
      //  passReqToCallback: true, 
    });
  }


  async validate(email: string, password: string): Promise<UserPayload | null> {

    const userPayload : UserPayload | null = await this.authService.verifyUser(email, password);
    return userPayload;
  }

}

