import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';
import { AuthRepository } from './auth.repository';
import { AuthGeneratorUtil } from '../../common/utils/auth-generator.util';
import { UserGeneratorUtil } from '../../common/utils/user-generator.util';
import { HashingService } from 'src/core/security/hashing/hashing.service';
import { UserService } from '../user/user.service';
import { ProfileGeneratorUtil } from 'src/common/utils/profile-generator.util';

@Injectable()
export class AuthService {
  [x: string]: any;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService, 
    private readonly hashService: HashingService, // Replace with actual Argon2 service 
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

  // You must create and assign the profile instance
  const profilePayload = ProfileGeneratorUtil.generate({}); // You can pass necessary data if needed
  userPayload.profile = profilePayload; // Assign the profile to the user
  console.log("Generated user payload:", userPayload);

  const savedUser = await this.userService.create(userPayload);
  const savedAuth = await this.authRepository.create(authPayload);  

  
  // RELOAD: This fetches the Auth AND the User together
   const auth =  await this.authRepository.findOne({
    where: { id: savedAuth.id },
    relations: ['user']
  });
  console.log("Newly created auth with user:", auth);
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
    return { message: 'Email verified successfully' };
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
