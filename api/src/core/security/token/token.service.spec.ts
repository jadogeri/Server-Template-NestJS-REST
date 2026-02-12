import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  
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
      // FIX: Changed 'id' to 'userId' to match the service logic
      const user = { userId: 1, email: 'test@test.com', roles: ['admin'] };
      
      accessMock.signAsync.mockResolvedValue('access-123');
      refreshMock.signAsync.mockResolvedValue('refresh-456');

      const result = await service.generateAuthTokens(user as any);

      expect(result).toEqual({
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
      });
      
      // FIX: Expect 'sub' and 'userId' to be the same value
      expect(accessMock.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({ 
          sub: user.userId, 
          userId: user.userId, 
          roles: user.roles 
        })
      );

      // FIX: Match the actual refresh payload structure from your service
      expect(refreshMock.signAsync).toHaveBeenCalledWith({ 
        sub: user.userId, 
        type: 'refresh' 
      });
    });
  });

  describe('Token Verification (Edge Cases)', () => {
    it('should throw an error if the refresh token is expired/invalid', async () => {
      refreshMock.verifyAsync.mockRejectedValue(new Error('Token expired'));
      
      await expect(service.verifyRefreshToken('bad-token'))
        .rejects.toThrow('Token expired');
      
      expect(refreshMock.verifyAsync).toHaveBeenCalledWith('bad-token');
    });

    it('should return the payload if verification is successful', async () => {
      const mockPayload = { sub: 1, type: 'refresh' };
      refreshMock.verifyAsync.mockResolvedValue(mockPayload);

      const result = await service.verifyRefreshToken('valid-token');
      expect(result).toEqual(mockPayload);
    });

    it('should throw if user payload is missing during token generation', async () => {
      // Confirms the app crashes safely if passed null (as per your current code)
      await expect(service.generateAuthTokens(null as any)).rejects.toThrow();
    });
  });

  describe('generateVerificationToken', () => {
    it('should use the specific verification service with correct payload', async () => {
      // Ensure this matches the property used in service (currently 'id' in your code)
      const user = { id: 5, email: 'verify@test.com' };
      await service.generateVerificationToken(user);
      
      expect(verifyMock.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({ 
          sub: user.id, 
          type: 'verification', 
          email: user.email 
        })
      );
    });
  });
});
