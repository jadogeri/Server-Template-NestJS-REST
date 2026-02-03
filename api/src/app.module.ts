import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [UserModule, AuthModule, SessionModule, ProfileModule, RoleModule, ContactModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
