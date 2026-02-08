import { MailerService } from '@nestjs-modules/mailer';
import { Service } from '../../../common/decorators/service.decorator';
import { CarrierType } from './types/carrier.type';
import { SmsServiceInterface } from './interfaces/sms-service.interface';
import { gatewayMap } from './types/gateway.type';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as handlebars from 'handlebars';
import { WelcomeEmailContext, VerificationEmailContext, MailContext, BaseEmailContext } from './interfaces/mail-context.interface';
import { ConfigService } from '@nestjs/config/dist/config.service';


@Service()
export class SmsService implements SmsServiceInterface {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}  
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
  async sendVerificationSms(to: string, context: VerificationEmailContext) {
    const fullContext: VerificationEmailContext = {
      ...this.getBaseContext(),
      ...context,
    };
    return await this.sendSms(to, 'verify-account', fullContext);
  }

  /**
   * Sends a welcome email
   */
  async sendWelcomeSms(to: string, context: WelcomeEmailContext) {
    const fullContext: WelcomeEmailContext = {
      ...this.getBaseContext(),
      ...context,
    };
    return await this.sendSms(to, 'welcome', fullContext);
  }

  async sendSms(phoneNumber: string,folder: string,  context: MailContext) { 
    const subjectPath = path.join(__dirname, 'templates', folder, 'subject.hbs');
    const subjectTemplate = fs.readFileSync(subjectPath, 'utf8');
    const compiledSubject = handlebars.compile(subjectTemplate)(context); 
    
 
    console.log(`Preparing to send SMS to ${phoneNumber} with message: verify email`);
    const carrier: CarrierType = 'boost'; // Example carrier; in real use, this would be dynamic

    const recipient = `${phoneNumber}${gatewayMap[carrier]}`;

    console.log(`Constructed recipient email: ${recipient}`);

    return await this.mailerService.sendMail({
      to: recipient,
      subject: undefined, // SMS usually ignores subjects
      template: `${folder}/html`,
      text: `${folder}/text`,
      context: context,
    });
  }
}

