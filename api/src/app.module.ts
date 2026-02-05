import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';
import { ContactModule } from './modules/contact/contact.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AuthModule } from './core/auth/auth.module';
import { SessionModule } from './core/session/session.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { dataSourceOptions } from './configs/type-orm.config';

@Module({
  imports: [
    UserModule, 
    AuthModule, 
    SessionModule, 
    ProfileModule, 
    RoleModule, 
    ContactModule, 
    PermissionModule,
    TypeOrmModule.forRoot({ ...dataSourceOptions }),    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
