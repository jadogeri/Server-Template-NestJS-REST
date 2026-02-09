import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleRepository } from './role.repository';
import { Role } from './entities/role.entity';
import { UserRole } from '../../common/enums/user-role.enum';

describe('RoleRepository', () => {
  let repository: RoleRepository;
  let typeormRepo: Repository<Role>;

  // Mock Factory
  const mockRepository = () => ({
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleRepository,
        {
          provide: getRepositoryToken(Role),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    repository = module.get<RoleRepository>(RoleRepository);
    typeormRepo = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  describe('findByUserRole', () => {
    it('should call findOne with correct relations and where clause', async () => {
      const mockRole = { id: 1, name: UserRole.ADMIN, permissions: [] };
      jest.spyOn(typeormRepo, 'findOne').mockResolvedValue(mockRole as any);

      const result = await repository.findByUserRole(UserRole.ADMIN);

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { name: UserRole.ADMIN },
        relations: ['permissions'],
      });
      expect(result).toEqual(mockRole);
    });
  });

  describe('BaseRepository methods (Inheritance test)', () => {
    it('should update an entity using preload and save', async () => {
      const updateData = { name: UserRole.USER };
      const preloadedRole = { id: 1, ...updateData };
      
      jest.spyOn(typeormRepo, 'preload').mockResolvedValue(preloadedRole as any);
      jest.spyOn(typeormRepo, 'save').mockResolvedValue(preloadedRole as any);

      const result = await repository.update(1, updateData as any);

      expect(typeormRepo.preload).toHaveBeenCalledWith({ id: 1, ...updateData });
      expect(typeormRepo.save).toHaveBeenCalledWith(preloadedRole);
      expect(result).toEqual(preloadedRole);
    });

    it('should return undefined if preload fails in update', async () => {
      jest.spyOn(typeormRepo, 'preload').mockResolvedValue(undefined );
      const result = await repository.update(999, {});
      expect(result).toBeNull();
    });
  });
});
