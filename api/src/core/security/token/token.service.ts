// src/auth/token/token.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    @Inject('ACCESS_TOKEN_JWT_SERVICE') private readonly accessJwtService: JwtService,
    @Inject('REFRESH_TOKEN_JWT_SERVICE') private readonly refreshJwtService: JwtService,
  ) {}

  async generateAuthTokens(user: any) {
    const payload = { sub: user.id, email: user.email, roles: user.roles };

    // Secrets and expiration are already baked into the services
    const [accessToken, refreshToken] = await Promise.all([
      this.accessJwtService.signAsync(payload),
      this.refreshJwtService.signAsync({ sub: user.id }),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string) {
    // Uses the refresh-specific service configuration
    return this.refreshJwtService.verifyAsync(token);
  }
}
