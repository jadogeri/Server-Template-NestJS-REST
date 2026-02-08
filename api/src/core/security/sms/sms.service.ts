import { MailerService } from '@nestjs-modules/mailer';
import { Service } from '../../../common/decorators/service.decorator';
import { CarrierType } from './types/carrier.type';
import { SmsServiceInterface } from './interfaces/sms-service.interface';

@Service()
export class SmsService implements SmsServiceInterface {
  constructor(private readonly mailerService: MailerService) {}

  async sendSms(phoneNumber: string,  message: string) {
    const carrier: CarrierType = 'boost'; // Example carrier; in real use, this would be dynamic
    const gateways = {
    verizon: '@vtext.com',      // Unreliable; no new users
    att: '@txt.att.net',        // DISCONTINUED June 2025
    tmobile: '@tmomail.net',    // Largely non-functional
    usCellular: '@email.uscc.net', 
    googleFi: '@msg.fi.google.com', 
    cricket: '@mms.cricketwireless.net', // DISCONTINUED June 2025
    boost: '@myboostmobile.com' // Reported offline
    };


    const recipient = `${phoneNumber}${gateways[carrier]}`;

    return await this.mailerService.sendMail({
      to: recipient,
      subject: '', // SMS usually ignores subjects
      text: message,
    });
  }
}
