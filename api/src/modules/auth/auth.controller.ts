import { Controller,Get, Post, Body, Patch, Delete, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ReactivateDto } from './dto/auth.dto';
//import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Assume standard JWT Guard


import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({ 
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'Example Auth Creation',
        value: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', dateOfBirth: '01-FEB-1990', password:"P@55W0rd" }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', dateOfBirth: '01-FEB-1990' }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Received registration data:', registerDto);
    return this.authService.register(registerDto);
  }

  // 2. Login: POST /auth/login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

    @Get('/me')
  me(@Request() req) {
    return this.authService.findAll();
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

    // 2. Permanent Delete
  //@UseGuards(JwtAuthGuard)
  @Delete('unregister')
  async unregister(@Request() req) {
    return this.authService.unregisterAccount(req.user.id);
  }

  // 3. Reactivate (Public - triggered by email link)
  @Post('reactivate')
  async reactivate(@Body() reactivateDto: ReactivateDto) {
    return this.authService.reactivateAccount(reactivateDto.token);
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
