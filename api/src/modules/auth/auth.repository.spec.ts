import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { Auth } from './entities/auth.entity';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let typeOrmRepo: Repository<Auth>;

  // Define a mock for the TypeORM Repository
  const mockTypeOrmRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          // This mocks the @InjectRepository(Auth) dependency
          provide: getRepositoryToken(Auth),
          useValue: mockTypeOrmRepository,
        },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
    typeOrmRepo = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should call findOne with the correct email criteria', async () => {
      const email = 'test@example.com';
      const mockAuth = { id: 1, email } as Auth;
      
      // Setup the mock return value
      jest.spyOn(typeOrmRepo, 'findOne').mockResolvedValue(mockAuth);

      const result = await repository.findByEmail(email);

      // Verify the underlying TypeORM method was called correctly
      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockAuth);
    });
  });

  describe('Inherited BaseRepository methods', () => {
    it('should call findAll via the base repository', async () => {
      await repository.findAll();
      expect(typeOrmRepo.find).toHaveBeenCalled();
    });

    it('should call findOneById with the correct ID', async () => {
      const id = 123;
      await repository.findOneById(id);
      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should create and save an entity', async () => {
      const authData = { email: 'new@test.com' };
      const mockEntity = { ...authData, id: 1 };
      
      mockTypeOrmRepository.create.mockReturnValue(mockEntity);
      mockTypeOrmRepository.save.mockResolvedValue(mockEntity);

      const result = await repository.create(authData);

      expect(typeOrmRepo.create).toHaveBeenCalledWith(authData);
      expect(typeOrmRepo.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toEqual(mockEntity);
    });
  });
});
