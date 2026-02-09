// src/core/security/security.module.ts
import { Module } from '@nestjs/common';
import { HashingModule } from './hashing/hashing.module';
import { TokenModule } from './token/token.module';
import { AccessControlModule } from './access-control/access-control.module';

@Module({
  imports: [HashingModule, TokenModule, AccessControlModule],
  exports: [HashingModule, TokenModule, AccessControlModule], // Export services for use in other modules
  providers: [],
})
export class SecurityModule {}
