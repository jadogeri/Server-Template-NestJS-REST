// src/auth/token/token.service.ts
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Service } from '../../../common/decorators/service.decorator';
import { UserPayload } from 'src/common/interfaces/user-payload.interface';
import { JwtPayloadInterface } from 'src/common/interfaces/jwt-payload.interface';


@Service()
export class TokenService {
  constructor(
    @Inject('ACCESS_TOKEN_JWT_SERVICE') private readonly accessJwtService: JwtService,
    @Inject('REFRESH_TOKEN_JWT_SERVICE') private readonly refreshJwtService: JwtService,
    @Inject('VERIFY_TOKEN_JWT_SERVICE') private readonly verifyJwtService: JwtService,
  ) {}

  async generateAuthTokens(user: UserPayload) {
    console.log("Generating auth tokens for user:", user);
    const jwtPayload: JwtPayloadInterface = {
      userId: user.userId,
      sub: user.userId, // Standard JWT subject claim
      email: user.email,  
      roles: user.roles,
      type: 'access', // Custom claim to identify token type
    }

    // Secrets and expiration are already baked into the services
    const [accessToken, refreshToken] = await Promise.all([
      this.accessJwtService.signAsync(jwtPayload),
      this.refreshJwtService.signAsync({ sub: user.userId, type: 'refresh' }) // Minimal payload for refresh token,
    ]);

    return { accessToken, refreshToken };
  }

  async verifyRefreshToken(token: string) {
    // Uses the refresh-specific service configuration
    return this.refreshJwtService.verifyAsync(token);
  }

  async generateVerificationToken(user: any) {
    // 2. Use a specific payload for verification
    const payload = { sub: user.id, email: user.email, type: 'verification' };
    const verificationToken = await this.verifyJwtService.signAsync(payload);
    return verificationToken;
  }

  async verifyEmailToken(token: string) {
    // 3. This will use the verification-specific secret and expiration
    return await this.verifyJwtService.verifyAsync(token);
  }
}
