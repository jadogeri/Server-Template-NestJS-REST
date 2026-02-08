// src/core/security/security.module.ts
import { Module, Global } from '@nestjs/common';
import { HashingModule } from './hashing/hashing.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';

//@Global() // Optional: Makes Hashing & Token services available everywhere
@Module({
  imports: [HashingModule, TokenModule, MailModule],
  exports: [HashingModule, TokenModule, MailModule],
})
export class SecurityModule {}
