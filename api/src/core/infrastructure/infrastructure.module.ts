// src/core/security/security.module.ts
import { Module, Global } from '@nestjs/common';
import { MailModule } from './mail/mail.module';


//@Global() // Optional: Makes Hashing & Token services available everywhere
@Module({
  imports: [MailModule],
  exports: [MailModule], // Export services for use in other modules
  providers: [],
})
export class InfrastructureModule {}
