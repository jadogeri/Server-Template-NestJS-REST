import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';
import { ContactModule } from './modules/contact/contact.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';
import dataSourceOptions from './configs/type-orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './core/mail/mail.service';


@Module({
  imports: [
    UserModule, 
    AuthModule, 
    SessionModule, 
    ProfileModule, 
    RoleModule, 
    ContactModule, 
    PermissionModule,
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    ConfigModule.forRoot({   isGlobal: true,  }),
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule {}

  