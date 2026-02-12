import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request, CookieOptions } from 'express';

@Injectable()
export class CookieService {
  private readonly REFRESH_COOKIE_NAME: string;
  private readonly logger = new Logger(CookieService.name);

  constructor(private readonly configService: ConfigService) {
    // Note: getOrThrow in NestJS usually only takes 1 argument. 
    // Using .get() with a fallback is safer for default values.
    this.REFRESH_COOKIE_NAME = this.configService.get<string>('REFRESH_TOKEN_COOKIE_NAME') ?? 'refreshToken';
  }

  /**
   * Centralized configuration getter.
   * FIX: secure must be TRUE in production (HTTPS) and FALSE in development (HTTP).
   */
  private get cookieOptions(): CookieOptions {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    //#TODO: Will comment out secure for development, but ensure to set it to true in production with HTTPS
    return {
      secure: false, //isProduction, // Set to true only for HTTPS production
      sameSite: this.configService.get<any>('COOKIE_SAME_SITE', 'strict'),
      maxAge: Number(this.configService.get('COOKIE_REFRESH_MAX_AGE', 604800000)),
      httpOnly: this.configService.get<boolean>('COOKIE_HTTPS_ONLY', true),
      path: '/',
    };
  }

  /**
   * Sets the refresh token cookie. 
   */
  async createRefreshToken(res: Response, token: string): Promise<boolean> {
    try {
      res.cookie(this.REFRESH_COOKIE_NAME, token, this.cookieOptions);
      this.logger.log(`Refresh cookie '${this.REFRESH_COOKIE_NAME}' set successfully.`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to set refresh cookie: ${error.message}`);
      return false;
    }
  }

  /**
   * Retrieves the refresh token from the request.
   */
  async getRefreshToken(request: Request): Promise<string | undefined> {
    return request.cookies?.[this.REFRESH_COOKIE_NAME];
  }

  /**
   * Updates the existing refresh token cookie with a new value.
   */
  async updateRefreshToken(res: Response, newToken: string): Promise<boolean> {
    return this.createRefreshToken(res, newToken);
  }

  /**
   * Clears the refresh token cookie on logout.
   */
  async deleteRefreshToken(res: Response): Promise<boolean> {
    try {
      res.clearCookie(this.REFRESH_COOKIE_NAME, { path: '/' });
      this.logger.log(`Refresh cookie '${this.REFRESH_COOKIE_NAME}' cleared.`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to clear refresh cookie: ${error.message}`);
      return false;
    }
  }
}
