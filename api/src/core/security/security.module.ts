// src/core/security/security.module.ts
import { Module } from '@nestjs/common';
import { HashingModule } from './hashing/hashing.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [HashingModule, TokenModule],
  exports: [HashingModule, TokenModule], // Export services for use in other modules
  providers: [],
})
export class SecurityModule {}
