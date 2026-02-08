import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let typeOrmRepo: Repository<User>;

  const mockTypeOrmRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockTypeOrmRepo,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    typeOrmRepo = module.get<Repository<User>>(getRepositoryToken(User));
    
    // Silence logs for cleaner test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('findByUserId', () => {
    it('should call findOne with specific relations', async () => {
      const mockUser = { id: 1, firstName: 'John' };
      mockTypeOrmRepo.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findByUserId(1);

      // Matches the structure sent to this.repository.findOne() in BaseRepository
      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['roles', 'roles.permissions'],
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByFirstName', () => {
    it('should filter by first name', async () => {
      const name = 'Jane';
      await userRepository.findByFirstName(name);
      
      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { firstName: name },
      });
    });
  });

  describe('update', () => {
    it('should preload and save data if entity exists', async () => {
      const updateData = { firstName: 'Updated' };
      const preloadedUser = { id: 1, ...updateData };

      mockTypeOrmRepo.preload.mockResolvedValue(preloadedUser);
      mockTypeOrmRepo.save.mockResolvedValue(preloadedUser);

      const result = await userRepository.update(1, updateData);

      expect(typeOrmRepo.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateData,
      });
      expect(typeOrmRepo.save).toHaveBeenCalledWith(preloadedUser);
      expect(result).toEqual(preloadedUser);
    });

    it('should return null if preload fails', async () => {
      mockTypeOrmRepo.preload.mockResolvedValue(null);

      const result = await userRepository.update(999, { firstName: 'NoOne' });

      expect(result).toBeNull();
      expect(typeOrmRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const userData = { firstName: 'Alice', email: 'alice@test.com' };
      mockTypeOrmRepo.create.mockReturnValue(userData);
      mockTypeOrmRepo.save.mockResolvedValue({ id: 1, ...userData });

      const result = await userRepository.create(userData);

      expect(typeOrmRepo.create).toHaveBeenCalledWith(userData);
      expect(typeOrmRepo.save).toHaveBeenCalledWith(userData);
      expect(result.id).toBe(1);
    });
  });
});
