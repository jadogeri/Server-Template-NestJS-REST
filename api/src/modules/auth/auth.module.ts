import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './entities/auth.entity';
import { AuthRepository } from './auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { HashingService } from '../../core/security/hashing/hashing.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [ UserModule, RoleModule, TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [HashingService, AuthService, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}

