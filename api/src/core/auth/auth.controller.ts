import { Controller,Get, Post, Body, Patch, Param, Delete,UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
//import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto } from '../auth/dto/auth.dto';
//import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Assume standard JWT Guard


import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  async findAll() {
    return await this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

    // 1. Register User: POST /auth/register
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // 2. Login: POST /auth/login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 3. Logout: POST /auth/logout (Requires JWT)
  //@UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  // 4. Forgot Password: POST /auth/forgot-password
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // 5. Reset Password: PATCH /auth/reset-password
  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // 6. Deactivate User: PATCH /auth/deactivate (Requires JWT)
  //@UseGuards(JwtAuthGuard)
  @Patch('deactivate')
  async deactivate(@Request() req) {
    return this.authService.deactivateUser(req.user.id);
    
  }

   /**
   * Final verification endpoint called by the Frontend.
   * Uses POST because it modifies the user's verification state.
   */
  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    // verifyEmailDto.token will contain the token from the URL
    return await this.authService.verifyEmail(verifyEmailDto.token);
  }
}
