import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          // Use a mock object instead of the real AuthService
          useValue: {
            register: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
            login: jest.fn().mockResolvedValue({ accessToken: 'mock-token' }),
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1 }),
            update: jest.fn().mockResolvedValue({ id: 1 }),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
            forgotPassword: jest.fn().mockResolvedValue({ message: 'Email sent' }),
            resetPassword: jest.fn().mockResolvedValue({ message: 'Success' }),
            deactivateUser: jest.fn().mockResolvedValue({ deactivated: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
