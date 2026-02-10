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
import { CoreModule } from './core/core.module';
import { AdminModule } from '@adminjs/nestjs';
import { adminJsConfig } from './configs/adminjs-config';
import { User } from './modules/user/entities/user.entity';
import { Role } from './modules/role/entities/role.entity';
import { Session } from './modules/session/entities/session.entity';
import { Permission } from './modules/permission/entities/permission.entity';
import { Auth } from './modules/auth/entities/auth.entity';
import { Profile } from './modules/profile/entities/profile.entity';
import { Contact } from './modules/contact/entities/contact.entity';


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
    ConfigModule.forRoot({ isGlobal: true }),
    // // Use the config you exported from adminjs-config.ts
    // AdminModule.createAdminAsync({
    //   useFactory: () => adminJsConfig,
    // }),
    AdminModule.createAdminAsync({
      useFactory: async () => {
        // Force a true dynamic import that ignores CommonJS conversion
        const { default: AdminJS } = await dynamicImport('adminjs');
        const { Database, Resource } = await dynamicImport('@adminjs/typeorm');
        
        AdminJS.registerAdapter({ Database, Resource });
        
        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [User, Role, Session, Permission, Auth, Profile, Contact],
          },
        };
      },
    }),
  ],
})

export class AppModule {}


// Add this helper function outside the class
const dynamicImport = async (packageName: string) => 
  new Function(`return import('${packageName}')`)();
