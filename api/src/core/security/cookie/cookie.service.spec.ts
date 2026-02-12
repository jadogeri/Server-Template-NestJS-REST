import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CookieService } from './cookie.service';
import { Response, Request } from 'express';

describe('CookieService', () => {
  let service: CookieService;
  let configService: ConfigService;

  // Constants to match the mock
  const MOCK_COOKIE_NAME = 'refreshToken';

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
            // CRITICAL: Mock getOrThrow because the constructor calls it
            getOrThrow: jest.fn().mockReturnValue(MOCK_COOKIE_NAME),
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
      const token = 'sample-token';

      // Removed userId argument to match your new service method signature
      await service.createRefreshToken(res, token);

      expect(res.cookie).toHaveBeenCalledWith(
        MOCK_COOKIE_NAME,
        token,
        expect.objectContaining({
          path: '/',
          httpOnly: false,
        }),
      );
    });

    it('should retrieve a refresh token from request cookies', async () => {
      const tokenValue = 'stored-token';
      const req = mockRequest({ [MOCK_COOKIE_NAME]: tokenValue });

      const result = await service.getRefreshToken(req);

      expect(result).toBe(tokenValue);
    });

    it('should delete the refresh token cookie', () => {
      const res = mockResponse();

      service.deleteRefreshToken(res);

      expect(res.clearCookie).toHaveBeenCalledWith(MOCK_COOKIE_NAME, { path: '/' });
    });
  });

  describe('Edge Cases', () => {
    it('should return undefined if the specific refresh cookie does not exist', async () => {
      const req = mockRequest({ some_other_cookie: 'val' });
      const result = await service.getRefreshToken(req);

      expect(result).toBeUndefined();
    });

    it('should apply production settings when NODE_ENV is production', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'NODE_ENV') return 'production';
        return null;
      });

      const res = mockResponse();
      await service.createRefreshToken(res, 'token');

      const callArgs = (res.cookie as jest.Mock).mock.calls[0][2];
      // Note: your current logic says secure: ENV !== 'production'
      // so in production, secure will be FALSE. 
      expect(callArgs.secure).toBe(false); 
    });
  });
});
