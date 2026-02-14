import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { HashingService } from '../../core/security/hashing/hashing.service';
import { TokenService } from '../../core/security/token/token.service';
import { MailService } from '../../core/infrastructure/mail/mail.service';
import { SessionService } from '../session/session.service';
import { CookieService } from '../../core/security/cookie/cookie.service';
import { PayloadMapperService } from './payload-mapper.service';
import { AccessControlService } from '../../core/security/access-control/access-control.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // Mock every dependency to avoid RootTestModule resolution issues
        {
          provide: AuthRepository,
          useValue: { findOne: jest.fn(), create: jest.fn(), update: jest.fn() },
        },
        {
          provide: UserService,
          useValue: { findOne: jest.fn(), create: jest.fn() },
        },
        {
          provide: RoleService,
          useValue: { findByUserRole: jest.fn() },
        },
        {
          provide: HashingService,
          useValue: { hash: jest.fn(), compare: jest.fn() },
        },
        {
          provide: TokenService,
          useValue: { generateVerificationToken: jest.fn(), verifyEmailToken: jest.fn() },
        },
        {
          provide: MailService,
          useValue: { sendVerificationEmail: jest.fn() },
        },
        {
          provide: SessionService,
          useValue: { create: jest.fn(), findOne: jest.fn(), update: jest.fn() },
        },
       {
           provide: CookieService,
          useValue: { create: jest.fn(), findOne: jest.fn(), update: jest.fn() },
        },
        {
          provide: PayloadMapperService,
          useValue: { toUserPayload: jest.fn() },
        },
        {
          provide: AccessControlService,
          useValue: { isUserVerified: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    
    // Optional: Silence logs during testing
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
