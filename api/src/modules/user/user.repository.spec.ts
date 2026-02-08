import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm'; // Add this
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

describe('UserRepository', () => {
  let repository: UserRepository;

  // Mock for the actual TypeORM Repository injected into your class
  const mockTypeOrmRepo = {
    findOne: jest.fn(),
    // add any other methods the BaseRepository calls
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          // This creates the token Nest is looking for in your constructor
          provide: getRepositoryToken(User),
          useValue: mockTypeOrmRepo,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

describe('UserRepository', () => {
  // ... existing setup from previous response ...

  describe('findByLastName', () => {
    it('should return a user when the last Name exists (Happy Path)', async () => {
      const lastName = 'Doe';
      const userMock = { id: 1, lastName: 'Doe' } as User;
      mockTypeOrmRepo.findOne.mockResolvedValue(userMock);

      const result = await repository.findOne({ where: { lastName: 'Doe' } });

      expect(result).toEqual(userMock);
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({ where: { lastName: 'Doe' } });
    });

    it('should return null when the lastName does not exist (Negative Path)', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.findOne({ where: { lastName: 'missing' } });

      expect(result).toBeNull();
    });

    it('should handle unusual first name formats (Edge Case)', async () => {
      const weirdFirstName= 'JOhn';
      mockTypeOrmRepo.findOne.mockResolvedValue({ firstName: weirdFirstName } as User);

      const result = await repository.findByFirstName(weirdFirstName);
      
      expect(result?.firstName).toBe(weirdFirstName);
    });
  });

  describe('findByUserId', () => {
    it('should fetch user with roles and permissions (Happy Path)', async () => {
      const userId = 99;
      // Injected mock for findOne (used by findOneById in your BaseRepository)
      mockTypeOrmRepo.findOne.mockResolvedValue({ id: userId, roles: [] });

      await repository.findByUserId(userId);

      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: userId },
        relations: ['roles', 'roles.permissions'],
      }));
    });

    it('should return null for non-existent ID (Negative Path)', async () => {
      mockTypeOrmRepo.findOne.mockResolvedValue(null);
      const result = await repository.findByUserId(9999);
      expect(result).toBeNull();
    });
  });

  describe('Database Resilience (Edge Cases)', () => {
    it('should throw an error if the database connection is lost', async () => {
      mockTypeOrmRepo.findOne.mockRejectedValue(new Error('QueryFailedError: connection lost'));

      await expect(repository.findByFirstName('john'))
        .rejects.toThrow('QueryFailedError: connection lost');
    });

    it('should handle extremely long string inputs', async () => {
      const longName = 'a'.repeat(255);
      mockTypeOrmRepo.findOne.mockResolvedValue(null);

      await repository.findByFirstName(longName);
      
      expect(mockTypeOrmRepo.findOne).toHaveBeenCalledWith({ 
        where: { firstName: longName } 
      });
    });
  });
});

});
