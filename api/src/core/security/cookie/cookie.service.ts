import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Response, Request, CookieOptions } from 'express';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class CookieService {

  private readonly REFRESH_COOKIE_NAME: string;
  constructor(
    // @Inject(REQUEST) private readonly request: Request & { res: Response },
    private readonly configService: ConfigService) {
      this.REFRESH_COOKIE_NAME = this.configService.get<string>('REFRESH_TOKEN_COOKIE_NAME', 'refreshToken');
    }    

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

    /**
   * Sets a generic refresh token cookie. 
   * The userId should be encoded INSIDE the token (JWT) or looked up via DB.
   */
  async createRefreshToken(res: Response, token: string) {
    res.cookie(this.REFRESH_COOKIE_NAME, token, this.cookieOptions);
  }

  /**
   * Retrieves the refresh token without needing to know the userId first.
   */
  async getRefreshToken(request: Request): Promise<string | undefined> {
    return request.cookies?.[this.REFRESH_COOKIE_NAME];
  }

  /**
   * Updates the existing refresh token cookie with a new value.
   */
  updateRefreshToken(res: Response, newToken: string) {
    this.createRefreshToken(res, newToken);
  }

  /**
   * Clears the refresh token cookie on logout.
   */
  deleteRefreshToken(res: Response) {
    res.clearCookie(this.REFRESH_COOKIE_NAME, { path: '/' });
  }
}
