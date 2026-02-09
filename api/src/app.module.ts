import { Module, Session } from '@nestjs/common';
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
import { CoreModule } from './core/core.module';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import { AdminModule } from '@adminjs/nestjs';
import { Permission } from './modules/permission/entities/permission.entity';
import { Contact } from './modules/contact/entities/contact.entity';
import { Profile } from './modules/profile/entities/profile.entity';
import { Auth } from './modules/auth/entities/auth.entity';
import { Role } from './modules/role/entities/role.entity';
import { Session as SessionEntity } from './modules/session/entities/session.entity';
import { User } from './modules/user/entities/user.entity';

@Module({
  imports: [
    CoreModule,
    UserModule, 
    AuthModule, 
    SessionModule, 
    ProfileModule, 
    RoleModule, 
    ContactModule, 
    PermissionModule,
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    ConfigModule.forRoot({   isGlobal: true,  }),
    AdminModule.createAdmin({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [User, Role, SessionEntity, Auth, Profile, Contact, Permission], // Entities you want to manage
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

  