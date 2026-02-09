import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  
  // Create a generic mock factory for JwtService
  const createMockJwtService = () => ({
    signAsync: jest.fn().mockResolvedValue('mock-token'),
    verifyAsync: jest.fn().mockResolvedValue({ sub: 1, email: 'test@test.com' }),
  });

  let accessMock: any;
  let refreshMock: any;
  let verifyMock: any;

  beforeEach(async () => {
    accessMock = createMockJwtService();
    refreshMock = createMockJwtService();
    verifyMock = createMockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: 'ACCESS_TOKEN_JWT_SERVICE', useValue: accessMock },
        { provide: 'REFRESH_TOKEN_JWT_SERVICE', useValue: refreshMock },
        { provide: 'VERIFY_TOKEN_JWT_SERVICE', useValue: verifyMock },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  describe('generateAuthTokens (Happy Path)', () => {
    it('should return both access and refresh tokens', async () => {
      const user = { id: 1, email: 'test@test.com', roles: ['admin'] };
      
      accessMock.signAsync.mockResolvedValue('access-123');
      refreshMock.signAsync.mockResolvedValue('refresh-456');

      const result = await service.generateAuthTokens(user);

      expect(result).toEqual({
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
      });
      
      // Verify correct payloads were sent to the specific services
      expect(accessMock.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({ sub: user.id, roles: user.roles })
      );
      expect(refreshMock.signAsync).toHaveBeenCalledWith({ sub: user.id });
    });
  });

  describe('Token Verification (Edge Cases)', () => {
    it('should throw an error if the refresh token is expired/invalid', async () => {
      refreshMock.verifyAsync.mockRejectedValue(new Error('Token expired'));
      
      await expect(service.verifyRefreshToken('bad-token'))
        .rejects.toThrow('Token expired');
      
      // Ensure it only checked the refresh service, not the access service
      expect(refreshMock.verifyAsync).toHaveBeenCalled();
      expect(accessMock.verifyAsync).not.toHaveBeenCalled();
    });

    it('should return the payload if verification is successful', async () => {
      const mockPayload = { sub: 1, type: 'verification' };
      verifyMock.verifyAsync.mockResolvedValue(mockPayload);

      const result = await service.verifyEmailToken('valid-token');
      expect(result).toEqual(mockPayload);
    });

    it('should handle missing user data in generateAuthTokens gracefully', async () => {
      // If user is null, accessing user.id will crash. 
      // This test confirms your code's current behavior (it will throw).
      await expect(service.generateAuthTokens(null))
        .rejects.toThrow();
    });
  });

  describe('generateVerificationToken', () => {
    it('should use the specific verification service', async () => {
      const user = { id: 5, email: 'verify@test.com' };
      await service.generateVerificationToken(user);
      
      expect(verifyMock.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'verification', email: user.email })
      );
    });
  });
});
