// src/auth/token/token.module.ts
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '../../../modules/auth/entities/auth.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Auth])],
  providers: [
    TokenService,
    // Provider for Access Tokens
    {
      provide: 'ACCESS_TOKEN_JWT_SERVICE',
      useFactory: (config: ConfigService) => {
        return new JwtService({
          secret: config.get('JWT_ACCESS_TOKEN_SECRET'),
          signOptions: { expiresIn: config.get('JWT_ACCESS_TOKEN_EXPIRATION_MS') },
        });
      },
      inject: [ConfigService],
    },
    // Provider for Refresh Tokens
    {
      provide: 'REFRESH_TOKEN_JWT_SERVICE',
      useFactory: (config: ConfigService) => {
        return new JwtService({
          secret: config.get('JWT_REFRESH_TOKEN_SECRET'),
          signOptions: { expiresIn: config.get('JWT_REFRESH_TOKEN_EXPIRATION_MS') },
        });
      },
      inject: [ConfigService],
    },
    // Provider for Verification Tokens
    {
      provide: 'VERIFY_TOKEN_JWT_SERVICE',
      useFactory: (config: ConfigService) => {
        return new JwtService({
          secret: config.get('JWT_VERIFY_TOKEN_SECRET'),
          signOptions: { expiresIn: config.get('JWT_VERIFY_TOKEN_EXPIRATION_MS') },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [TokenService],
})
export class TokenModule {}
