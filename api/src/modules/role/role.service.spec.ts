import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';

describe('RoleService', () => {
  let service: RoleService;
  let repository: RoleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          // Mock the specific methods the service calls
          useValue: {
            findByUserRole: jest.fn().mockResolvedValue({ id: 1, name: 'ADMIN' }),
            findOne: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    repository = module.get<RoleRepository>(RoleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserRole', () => {
    it('should call repository.findByUserRole with correct argument', async () => {
      const roleEnum = 'ADMIN' as any;
      await service.findByUserRole(roleEnum);
      
      expect(repository.findByUserRole).toHaveBeenCalledWith(roleEnum);
    });
  });
});
