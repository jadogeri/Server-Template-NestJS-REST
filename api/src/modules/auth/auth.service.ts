import { BadRequestException, ConflictException, GoneException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';
import { AuthRepository } from './auth.repository';
import { AuthGeneratorUtil } from '../../common/utils/auth-generator.util';
import { UserGeneratorUtil } from '../../common/utils/user-generator.util';
import { HashingService } from 'src/core/security/hashing/hashing.service';
import { UserService } from '../user/user.service';
import { ProfileGeneratorUtil } from 'src/common/utils/profile-generator.util';
import { Service } from '../../common/decorators/service.decorator';
import { RoleService } from '../role/role.service';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Resource } from 'src/common/enums/resource.enum';
import { Role } from '../role/entities/role.entity';
import { RoleNotFoundException } from 'src/common/exceptions/role-not-found.exception';
import { TokenService } from 'src/core/security/token/token.service';
import { MailService } from 'src/core/security/mail/mail.service';
import { log } from 'console';
import { TokenExpiredError } from '@nestjs/jwt';
import { AuthNotFoundException } from 'src/common/exceptions/auth-not-found.exception';
import { Not } from 'typeorm';


@Service()
export class AuthService {
  [x: string]: any;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService, 
    private readonly roleService: RoleService,
    private readonly hashService: HashingService, // Replace with actual Argon2 service 
    private readonly tokenService: TokenService, // For JWT generation
    private readonly mailService: MailService, // For sending emails
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async findAll() {
    return await this.authRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

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

    // You must create and assign the profile and role instance
    const profilePayload = ProfileGeneratorUtil.generate({}); // You can pass necessary data if needed
    userPayload.profile = profilePayload; // Assign the profile to the user

    
    console.log("Generated user payload:", userPayload);

    const savedAuth = await this.authRepository.create(authPayload);  
    
    // RELOAD: This fetches the Auth AND the User together
    const auth =  await this.authRepository.findOne({
      where: { id: savedAuth.id },
      relations: ['user' , 'user.roles'] // Ensure roles are included
    });
    console.log("Newly created auth with user:", auth);

    if (auth?.user) {
    //Generate verification token and send email (optional)
      const verificationTokenPayload = { id: auth?.user?.id, email: email};
      console.log("Generated verification token payload:", verificationTokenPayload);

      const verificationToken = await this.tokenService.generateVerificationToken(verificationTokenPayload);
      console.log("Generated verification token:", verificationToken);

     const updatedUser = await this.authRepository.update(auth.user.id, { verificationToken });
     console.log('Updated User with Verification Token:', updatedUser);

     // Send verification email using MailService
     const context = {
      firstName: auth.user.firstName,
      verificationLink: `http://localhost:3000/auth/verify-email?token=${verificationToken}`,
      logoUrl: 'https://cdn.dribbble.com/userupload/41930880/file/original-633d9b239c12bbb0788b9faf25058c54.png', // Optional: Add your logo URL here
      companyName: 'Your Company Name', // Optional: Add your company name here
      year: new Date().getFullYear(), // Optional: Add current year for footer
     };
     console.log("Email context for Handlebars:", context);

     const result = await this.mailService.sendEmail(email, 'verify-account', context);
     console.log('Verification email sent to:', email);
      console.log('Email sending result:', result);
    }
    

    return auth;
  }

  // 2. Login logic
  async login(loginDto: LoginDto) {
    // Logic: Validate user, sign and return JWT
    return { 
      access_token: 'placeholder_jwt_token',
      user: loginDto.email 
    };
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
        await this.authRepository.update(userAccount.id, { isVerified: true, verificationToken:null, verifiedAt: new Date() });
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

     const updatedUser = await this.authRepository.update(auth.user.id, { verificationToken });
     console.log('Updated User with Verification Token:', updatedUser);

     // Send verification email using MailService
     const context = {
      firstName: auth.user.firstName,
      verificationLink: `http://localhost:3000/auth/verify-email?token=${verificationToken}`,
      logoUrl: 'https://cdn.dribbble.com/userupload/41930880/file/original-633d9b239c12bbb0788b9faf25058c54.png', // Optional: Add your logo URL here
      companyName: 'Your Company Name', // Optional: Add your company name here
      year: new Date().getFullYear(), // Optional: Add current year for footer
     };
     console.log("Email context for Handlebars:", context);

     const result = await this.mailService.sendEmail(email, 'verify-account', context);
     console.log('Verification email sent to:', email);
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
}

