import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

describe('UserRepository', () => {
  let repository: UserRepository;
  let entityManager: EntityManager;

  // Create a mock for EntityManager
  const mockEntityManager = {
    findOne: jest.fn(),
    // BaseRepository needs these to initialize
    connection: { registry: { get: jest.fn() } },
    queryRunner: {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should call findOne with correct email filter', async () => {
      const email = 'test@example.com';
      const userMock = { id: 1, email } as User;
      
      // Mock the findOne method inherited from BaseRepository
      jest.spyOn(repository, 'findOne').mockResolvedValue(userMock);

      const result = await repository.findByEmail(email);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email } });
      expect(result).toEqual(userMock);
    });
  });

  describe('findByUsername', () => {
    it('should call findOne with firstName filter', async () => {
      const username = 'John';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await repository.findByUsername(username);

      expect(repository.findOne).toHaveBeenCalledWith({ 
        where: { firstName: username } 
      });
    });
  });
});
