
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as handlebars from 'handlebars';
import { Service } from '../../../common/decorators/service.decorator';
import { WelcomeEmailContext, VerificationEmailContext, MailContext, BaseEmailContext } from './interfaces/mail-context.interface';
import { ConfigService } from '@nestjs/config/dist/config.service';

// Assuming these are imported from your interfaces file
// import { WelcomeEmailContext, VerificationEmailContext, MailContext, BaseEmailContext } from './interfaces';

@Service()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService) {}

  /**
   * Core reusable method
   */
  async sendEmail(to: string, folder: string, context: MailContext) {
    const subjectPath = path.join(__dirname, 'templates', folder, 'subject.hbs');
    const subjectTemplate = fs.readFileSync(subjectPath, 'utf8');
    const compiledSubject = handlebars.compile(subjectTemplate)(context);

    return await this.mailerService.sendMail({
      to: to,
      subject: compiledSubject,
      template: `${folder}/html`,
      text: `${folder}/text`,
      context: context,
    });
  }

    /**
   * Returns a complete BaseEmailContext
   */
  private getBaseContext(): BaseEmailContext {
    return {
      companyName: this.configService.get<string>('COMPANY_NAME') || 'Your Company Name',
      year: new Date().getFullYear(),
      logoUrl: this.configService.get<string>('LOGO_URL') || 'https://yourdomain.com', // Optional in interface, but provided here
    };
  }

  /**
   * Sends a verification email
   */
  async sendVerificationEmail(to: string, context: VerificationEmailContext) {
    const fullContext: VerificationEmailContext = {
      ...this.getBaseContext(),
      ...context,
    };
    return await this.sendEmail(to, 'verify-account', fullContext);
  }

  /**
   * Sends a welcome email
   */
  async sendWelcomeEmail(to: string, context: WelcomeEmailContext) {
    const fullContext: WelcomeEmailContext = {
      ...this.getBaseContext(),
      ...context,
    };
    return await this.sendEmail(to, 'welcome', fullContext);
  }




}
