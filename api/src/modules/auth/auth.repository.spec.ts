import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { Auth } from './entities/auth.entity';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let typeOrmRepo: Repository<Auth>;

  const mockTypeOrmRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: getRepositoryToken(Auth),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
    typeOrmRepo = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  describe('findByEmail', () => {
    it('should call findOne with the correct email criteria and nested relations', async () => {
      const email = 'test@example.com';
      
      // Setup mock to resolve safely
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      await repository.findByEmail(email);

      // The fix: explicitly include the nested relations found in the error trace
      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { email },
        relations: [
          'user',
          'user.roles',
          'user.roles.permissions',
        ],
      });
    });
  });
});
