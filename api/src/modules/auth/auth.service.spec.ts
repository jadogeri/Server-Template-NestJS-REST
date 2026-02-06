import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository'; // Import your custom repository
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';

describe('AuthService', () => {
  let service: AuthService;

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
        {
          // AuthRepository needs this internally because of @InjectRepository(Auth)
          provide: getRepositoryToken(Auth),
          useValue: mockTypeOrmRepo,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
