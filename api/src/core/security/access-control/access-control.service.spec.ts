import { Test, TestingModule } from '@nestjs/testing';
import { AccessControlService } from './access-control.service';
import { Auth } from '../../../modules/auth/entities/auth.entity';

describe('AccessControlService', () => {
  let service: AccessControlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccessControlService],
    }).compile();

    service = module.get<AccessControlService>(AccessControlService);
  });

  describe('isUserActive', () => {
    it('should return true if auth.isEnabled is true', () => {
      const mockAuth = { isEnabled: true } as Auth;
      expect(service.isUserActive(mockAuth)).toBe(true);
    });

    it('should return false if auth.isEnabled is false', () => {
      const mockAuth = { isEnabled: false } as Auth;
      expect(service.isUserActive(mockAuth)).toBe(false);
    });

    it('should handle null/undefined safely (optional chaining test)', () => {
      expect(service.isUserActive(null as any)).toBeUndefined();
    });
  });

  describe('isUserVerified', () => {
    it('should return true if auth.isVerified is true', () => {
      const mockAuth = { isVerified: true } as Auth;
      expect(service.isUserVerified(mockAuth)).toBe(true);
    });

    it('should return false if auth.isVerified is false', () => {
      const mockAuth = { isVerified: false } as Auth;
      expect(service.isUserVerified(mockAuth)).toBe(false);
    });
  });
});
