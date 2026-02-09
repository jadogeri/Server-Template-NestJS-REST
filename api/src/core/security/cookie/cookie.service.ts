import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request, CookieOptions } from 'express';

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  // Centralized configuration getter
  private get cookieOptions(): CookieOptions {
    return {
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: this.configService.get<any>('COOKIE_SAME_SITE', 'strict'),
      maxAge: Number(this.configService.get('COOKIE_REFRESH_MAX_AGE', 604800000)),
      httpOnly: this.configService.get<boolean>('COOKIE_HTTPS_ONLY', false),
      path: '/',
    };
  }

  createRefreshToken(res: Response, userId: string, token: string) {
    res.cookie(`refresh_${userId}`, token, this.cookieOptions);
  }

  getRefreshToken(req: Request, userId: string): string | undefined {
    return req.cookies[`refresh_${userId}`];
  }

  updateRefreshToken(res: Response, userId: string, newToken: string) {
    this.createRefreshToken(res, userId, newToken);
  }

  deleteRefreshToken(res: Response, userId: string) {
    res.clearCookie(`refresh_${userId}`, { path: '/' });
  }
}
