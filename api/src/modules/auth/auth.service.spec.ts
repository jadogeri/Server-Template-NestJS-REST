import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository'; // Import your custom repository
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { HashingService } from '../../core/security/hashing/hashing.service';
import { RoleService } from '../role/role.service';
import { TokenService } from '../../core/security/token/token.service';
import { MailService } from '../../core/security/mail/mail.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let hashService: HashingService; // Mock or actual hashing service

  const mockTypeOrmRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    // ... add other base methods if needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AuthRepository, // Provide the actual custom repository class
        UserService,
        RoleService,
        HashingService,
        TokenService,
        MailService,
        {
          // AuthRepository needs this internally because of @InjectRepository(Auth)
          provide: getRepositoryToken(Auth),
          useValue: mockTypeOrmRepo,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });




  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
