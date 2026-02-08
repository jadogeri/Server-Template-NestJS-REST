import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from './hashing.service';
import { ConfigService } from '@nestjs/config';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HashingService,
        {
          provide: ConfigService,
          useValue: {
            // Mock .get() to return a dummy secret so Buffer.from doesn't crash
            get: jest.fn((key: string, defaultValue: any) => {
              if (key === 'ARGON2_SECRET') return 'test-secret-at-least-16-chars';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password and verify it', async () => {
    const password = 'password123';
    const hash = await service.hash(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toEqual(password);

    const isMatch = await service.compare(password, hash);
    expect(isMatch).toBe(true);
  });
});
