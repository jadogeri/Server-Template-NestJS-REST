import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          // Mock the methods the service actually calls
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call userRepository.create with dto', async () => {
      const dto = { email: 'test@test.com' } as any;
      await service.create(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
    });
  });
});
