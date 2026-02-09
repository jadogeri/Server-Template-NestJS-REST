import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Response, Request, CookieOptions } from 'express';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class CookieService {
  constructor(
    // @Inject(REQUEST) private readonly request: Request & { res: Response },
    private configService: ConfigService) {}    

  // Centralized configuration getter
  private get cookieOptions(): CookieOptions {
    return {
      secure: this.configService.get<string>('NODE_ENV') !== 'production',
      sameSite: this.configService.get<any>('COOKIE_SAME_SITE', 'strict'),
      maxAge: Number(this.configService.get('COOKIE_REFRESH_MAX_AGE', 604800000)),
      httpOnly: this.configService.get<boolean>('COOKIE_HTTPS_ONLY', false),
      path: '/',
    };
  }

    // Helper to access the response object internally
//   private get res(): Response {
//     return this.request.res;
//   }

  async createRefreshToken(res: Response, userId: string, token: string) {
    console.log(`Setting refresh token cookie for userId: ${userId} with options:`, this.cookieOptions);
   res.cookie(`refresh_${userId}`, token, this.cookieOptions);
  }

  async getRefreshToken(request: Request, userId: string): Promise<string | undefined> {
    return await request.cookies[`refresh_${userId}`];
  }

  updateRefreshToken(res: Response, userId: string, newToken: string) {
    this.createRefreshToken(res, userId, newToken);
  }

  deleteRefreshToken(res: Response, userId: string) {
    res.clearCookie(`refresh_${userId}`, { path: '/' });
  }
}
