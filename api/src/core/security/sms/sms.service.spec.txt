import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { SmsService } from './sms.service';

describe('SmsService', () => {
  let service: SmsService;
  let mailerService: MailerService;

  // Create a mock object for MailerService
  const mockMailerService = {
    sendMail: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          // Tell Nest to use our mock instead of the real MailerService
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email to the correct gateway address', async () => {
    const phone = '1234567890';
    const message = 'Hello World';
    
    await service.sendSms(phone, message);

    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: '1234567890@myboostmobile.com', // based on your 'boost' hardcode
      subject: '',
      text: message,
    });
  });
});
