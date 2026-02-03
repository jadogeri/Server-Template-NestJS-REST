import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [UserModule, AuthModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
