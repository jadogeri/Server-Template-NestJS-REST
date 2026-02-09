import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CookieService } from './cookie.service';
import { Response, Request } from 'express';

describe('CookieService', () => {
  let service: CookieService;
  let configService: ConfigService;

  // Mock for Express Response
  const mockResponse = () => {
    const res = {} as Response;
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
  };

  // Mock for Express Request
  const mockRequest = (cookies = {}) => ({
    cookies: cookies,
  } as unknown as Request);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CookieService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config = {
                NODE_ENV: 'development',
                COOKIE_SAME_SITE: 'strict',
                COOKIE_REFRESH_MAX_AGE: 604800000,
                COOKIE_HTTPS_ONLY: false,
              };
              return config[key] ?? defaultValue;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CookieService>(CookieService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('Happy Paths', () => {
    it('should create a refresh token cookie with correct naming', async () => {
      const res = mockResponse();
      const userId = '123';
      const token = 'sample-token';

      await service.createRefreshToken(res, userId, token);

      expect(res.cookie).toHaveBeenCalledWith(
        `refresh_${userId}`,
        token,
        expect.objectContaining({
          path: '/',
          httpOnly: false,
        }),
      );
    });

    it('should retrieve a refresh token from request cookies', async () => {
      const userId = '123';
      const tokenValue = 'stored-token';
      const req = mockRequest({ [`refresh_${userId}`]: tokenValue });

      const result = await service.getRefreshToken(req, userId);

      expect(result).toBe(tokenValue);
    });

    it('should delete the refresh token cookie', () => {
      const res = mockResponse();
      const userId = '123';

      service.deleteRefreshToken(res, userId);

      expect(res.clearCookie).toHaveBeenCalledWith(`refresh_${userId}`, { path: '/' });
    });
  });

  describe('Edge Cases', () => {
    it('should return undefined if the specific refresh cookie does not exist', async () => {
      const req = mockRequest({ some_other_cookie: 'val' });
      const result = await service.getRefreshToken(req, '999');

      expect(result).toBeUndefined();
    });

    it('should handle missing cookies object in request safely', async () => {
        // Simulating request where cookie-parser might not have run
        const req = {} as Request; 
        const result = await service.getRefreshToken(req, '123');
        expect(result).toBeUndefined();
    });

    it('should apply production settings when NODE_ENV is production', async () => {
      // Override the mock for this specific test
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'NODE_ENV') return 'production';
        return null;
      });

      const res = mockResponse();
      await service.createRefreshToken(res, '1', 'token');

      // The 'secure' flag in your code is logic: NODE_ENV !== 'production'
      // Based on your current code: secure will be FALSE if ENV is production.
      // (Usually, you want the opposite, but testing your specific logic here)
      const callArgs = (res.cookie as jest.Mock).mock.calls[0][2];
      expect(callArgs.secure).toBe(false); 
    });
  });
});
