// src/core/mail/mail.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
// REMOVE the HandlebarsAdapter import
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'node:path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access its service
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('NODEMAILER_HOST'),
          port: configService.get<number>('NODEMAILER_PORT'),
          auth: {
            user: configService.get('NODEMAILER_USER'),
            pass: configService.get('NODEMAILER_PASS'),
          },
        },
        defaults: {
          from: configService.get('NODEMAILER_FROM'),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  exports: [SmsService],
  providers: [SmsService],
})
export class SmsModule {}
