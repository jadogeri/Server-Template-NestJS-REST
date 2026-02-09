// src/core/security/security.module.ts
import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [MailModule],
  exports: [MailModule], // Export services for use in other modules
  providers: [],
})
export class InfrastructureModule {}
