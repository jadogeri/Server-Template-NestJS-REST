import { MailerService } from '@nestjs-modules/mailer';
import { Service } from '../../../common/decorators/service.decorator';
import { CarrierType } from './types/carrier.type';
import { SmsServiceInterface } from './interfaces/sms-service.interface';
import { gatewayMap } from './types/gateway.type';

@Service()
export class SmsService implements SmsServiceInterface {
  constructor(private readonly mailerService: MailerService) {}

  async sendSms(phoneNumber: string,  message: string) {
    const carrier: CarrierType = 'boost'; // Example carrier; in real use, this would be dynamic

    const recipient = `${phoneNumber}${gatewayMap[carrier]}`;

    return await this.mailerService.sendMail({
      to: recipient,
      subject: '', // SMS usually ignores subjects
      text: message,
    });
  }
}
