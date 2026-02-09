// src/core/security/security.module.ts
import { Module } from '@nestjs/common';
import { HashingModule } from './hashing/hashing.module';
import { TokenModule } from './token/token.module';
import { AccessControlModule } from './access-control/access-control.module';
import { CookieModule } from './cookie/cookie.module';

@Module({
  imports: [HashingModule, TokenModule, AccessControlModule, CookieModule],
  exports: [HashingModule, TokenModule, AccessControlModule, CookieModule], // Export services for use in other modules
  providers: [],
})
export class SecurityModule {}
