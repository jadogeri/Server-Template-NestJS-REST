import { BadRequestException, ConflictException, GoneException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, ResetPasswordDto } from './dto/auth.dto';
import { AuthRepository } from './auth.repository';
import { AuthGeneratorUtil } from '../../common/utils/auth-generator.util';
import { UserGeneratorUtil } from '../../common/utils/user-generator.util';
import { HashingService } from '../../core/security/hashing/hashing.service';
import { UserService } from '../user/user.service';
import { ProfileGeneratorUtil } from '../../common/utils/profile-generator.util';
import { Service } from '../../common/decorators/service.decorator';
import { RoleService } from '../role/role.service';
import { TokenService } from '../../core/security/token/token.service';
import { MailService } from '../../core/infrastructure/mail/mail.service';
import { log } from 'node:console';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthNotFoundException } from '../../common/exceptions/auth-not-found.exception';
import { VerificationEmailContext } from '../../core/infrastructure/mail/interfaces/mail-context.interface';
import { User } from '../user/entities/user.entity';
import { UserPayload } from '../../common/interfaces/user-payload.interface';
import { SessionService } from '../session/session.service';
import { CookieService } from '../../core/security/cookie/cookie.service';
import {  Request,Response } from 'express';

@Service()
export class AuthService {

  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService, 
    private readonly roleService: RoleService,
    private readonly hashService: HashingService, // Replace with actual Argon2 service 
    private readonly tokenService: TokenService, // For JWT generation
    private readonly mailService: MailService, // For sending emails
    private readonly sessionService: SessionService, // Assume session service exists
    private readonly cookieService: CookieService, // For managing cookies
  ) {}
 
  // 1. Register logic
  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, dateOfBirth } = registerDto;
    
    const existingUser = await this.authRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException(`Email address "${email}" has already been registered.`);
    }
    const userPayload = UserGeneratorUtil.generate({ firstName, lastName, dateOfBirth });
    const hashedPassword = await this.hashService.hash(password);    
    const authPayload = AuthGeneratorUtil.generate({ email, password: hashedPassword });
    authPayload.user = userPayload; // Cascading will handle the user creation

    const profilePayload = ProfileGeneratorUtil.generate({}); // You can pass necessary data if needed
    userPayload.profile = profilePayload; // Assign the profile to the user

    const savedAuth = await this.authRepository.create(authPayload);  
    
    // RELOAD: This fetches the Auth AND the User together
    const auth =  await this.authRepository.findOne({
      where: { id: savedAuth.id }, relations: ['user' , 'user.roles'] // Ensure roles are included
    });
    //console.log("Newly created auth with user:", auth);

    if (auth?.user) {
    //Generate verification token and send email (optional)
      const verificationTokenPayload = { id: auth?.user?.id, email: email};
      console.log("Generated verification token payload:", verificationTokenPayload);

      const verificationToken = await this.tokenService.generateVerificationToken(verificationTokenPayload);
      console.log("Generated verification token:", verificationToken);

      await this.authRepository.update(auth.user.id, { verificationToken });

     const context : VerificationEmailContext = {
      firstName: auth.user.firstName,      
      verificationLink: `http://localhost:3000/auth/verify-email?token=${verificationToken}`,
     };
     await this.mailService.sendVerificationEmail(email, context);     
     console.log('Verification email sent to:', email);
      return { message: 'Registration successful. Please check your email to verify your account.' };
    }else {   
      throw new NotFoundException('User acocount not created successfully.');
    }
  }

  // 2. Login logic
  async login(req: Request, res: Response, userPayload: UserPayload): Promise<{ accessToken: string; refreshToken: string; userId: number } | null> {
    console.log("AuthService.signIn called with userPayload:", userPayload);
    const data = await this.tokenService.generateAuthTokens(userPayload); 
    console.log("Generated tokens:", data);
    // Here you would implement the actual token generation logic

    //create a session
    //const refreshTokenHash = await this.bcryptService.hashData(data.refreshToken);
    //#TODO : Hash the refresh token before storing
    // For demo purposes, we are storing it as is
    // data.refreshToken will be hashed later with argon2
    const userRefreshToken = data.refreshToken; // Storing plain for demo; hash in production
    const hashedRefreshToken = await this.hashService.hash(userRefreshToken);
    console.log("Hashed refresh token:", hashedRefreshToken);
    const createSessionDto = { userId: userPayload.userId, refreshTokenHash: hashedRefreshToken };
    const session = await this.sessionService.create(createSessionDto);

    await this.cookieService.deleteRefreshToken(res); // Clear any existing refresh token cookie  
    await this.cookieService.createRefreshToken(res, userRefreshToken);
    //#TODO Add refresh token to cookies
    console.log("Created session:", session);
  

  console.log("retrieving cookie testing... ");
  const refreshTokenFromCookie = await this.cookieService.getRefreshToken(req);
  console.log("Refresh token retrieved from cookie:", refreshTokenFromCookie);
  if (refreshTokenFromCookie) {
    const isValid = await this.hashService.compare(refreshTokenFromCookie, session.refreshTokenHash);
    console.log("Is refresh token from cookie valid?", isValid);  
  } else {
    console.log("No refresh token found in cookie for userId:", userPayload.userId);
  }

      return {
      accessToken: data.accessToken,
      refreshToken: userRefreshToken,
      userId: userPayload.userId
    }
}

  // 3. Forgot Password logic
  async forgotPassword(email: string) {
    // Logic: Generate token, save to DB, send email
    return { message: `Password reset link sent to ${email}` };
  }

  // 4. Reset Password logic
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Logic: Verify token, hash new password, update DB
    return { message: 'Password has been reset successfully' };
  }

  // 5. Deactivate logic
  async deactivateUser(userId: string) {
    // Logic: Update user status to 'inactive' in DB
    return { message: `Account ${userId} deactivated` };
  }

  // 6. Logout logic
  async logout(user: any) {
    // Logic: Invalidate token (if using blacklisting) or clear session
    return { message: 'Logout successful' };
  }

  // 7. Verify Email logic
  async verifyEmail(token: string) {
    // Logic: Verify token, update user status to 'verified' in DB
  try {
      const payload = await this.tokenService.verifyEmailToken(token);
      console.log('Email verification token payload:', payload);
      const{ id, email } = payload;
      const userAccount = await this.authRepository.findOne({ where: { user: { id }, email }, relations: ['user'] });
      if (!userAccount) {
        return { message:" success" }
      }
      if (userAccount.isVerified) {
       throw new ConflictException({ message: 'Your email is already verified. You can proceed to login.',
                alreadyVerified: true });
      }else{
        await this.authRepository.update(userAccount.id, { isEnabled: true, isVerified: true, verificationToken: null, verifiedAt: new Date() });
      }
      return {payload};
      // ... update user to verified in DB  
    } catch (error:unknown) {
      if (error instanceof TokenExpiredError) {
        log('Error verifying email token:', error.message);
        throw new GoneException('Verification link expired. Please request a new one.');

      }
      log('Error verifying email token:', error instanceof Error ? error.message : error);
      throw new BadRequestException('Invalid verification token.');
    }
  }
// auth.service.ts
async resendVerification(email: string) {
  const auth = await this.authRepository.findByEmail(email); //
  
  if (!auth) {
    throw new AuthNotFoundException(email, 'email');
  }
  
  if (auth.isVerified) {
    throw new BadRequestException('Email is already verified');
  }

  // Reuse your existing email sending logic here

    console.log("Newly created auth with user:", auth);

    if (!auth?.user) {
      throw new NotFoundException('User not found for the provided auth information.');
    }
    //Generate verification token and send email (optional)
      const verificationTokenPayload = { id: auth?.user?.id, email: email};
      console.log("Generated verification token payload:", verificationTokenPayload);

      const verificationToken = await this.tokenService.generateVerificationToken(verificationTokenPayload);
      console.log("Generated verification token:", verificationToken);

     const updatedUser = await this.authRepository.update(auth.id, { verificationToken });
     console.log('Updated User with Verification Token:', updatedUser);

     // Send verification email using MailService
     const context : VerificationEmailContext = {
      firstName: auth.user.firstName,
      verificationLink: `http://localhost:3000/auth/verify-email?token=${verificationToken}`,
     };
     console.log("Email context for Handlebars:", context);

     const result = await this.mailService.sendVerificationEmail(email, context);
      console.log('Email sending result:', result);

  return { message: 'A new verification link has been sent to your email.' };

}


  // 8. Reactivate logic
  async reactivateAccount(token: string) {
    // Logic: Verify token, update user status to 'active' in DB
    return { message: 'Account reactivated successfully' };
  }
  // 9. Unregister logic
  async unregisterAccount(userId: string) {
    // Logic: Permanently delete user from DB
    return { message: `Account ${userId} permanently deleted` };
  }    

  async verifyUser(email: string, password: string) {
    try {
      const auth = await this.authRepository.findByEmail(email);
      if (!auth) {
        throw new UnauthorizedException("User not found");
      }

      // ALWAYS use the service so the pepper logic stays identical
      const authenticated = await this.hashService.compare(password, auth.password);

      if (!authenticated) {
        throw new UnauthorizedException("Invalid credentials");
      }
        const user = await this.userService.findByUserId(auth.user.id); // Fetch user with roles and permissions
    
      return user;
    } catch (error) {
      this.logger.error('Verify user error', error);
      throw new UnauthorizedException('Credentials are not valid');
    }
  }

  async findByEmail(email: string) {
    return await this.authRepository.findByEmail(email);
  }
}

