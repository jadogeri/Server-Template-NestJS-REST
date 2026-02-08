// src/core/security/security.module.ts
import { Module, Global } from '@nestjs/common';
import { HashingModule } from './hashing/hashing.module';
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import { SmsModule } from './sms/sms.module';

//@Global() // Optional: Makes Hashing & Token services available everywhere
@Module({
  imports: [HashingModule, TokenModule, MailModule, SmsModule],
  exports: [HashingModule, TokenModule, MailModule, SmsModule], // Export services for use in other modules
  providers: [],
})
export class SecurityModule {}
