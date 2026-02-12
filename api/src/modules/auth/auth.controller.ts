import { Controller,Get, Post, Body, Patch, Delete, HttpCode, HttpStatus, Query, UseGuards, Req, Res } from '@nestjs/common';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ReactivateDto } from './dto/auth.dto';
//import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Assume standard JWT Guard
import type { Request, Response } from 'express';


import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TokenValidationPipe } from '../../common/pipes/token-validation.pipe';
import { EmailValidationPipe } from '../../common/pipes/email-validation.pipe';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import type { UserPayload } from '../../common/interfaces/user-payload.interface';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { JwtPayload } from '../../common/decorators/jwt-payload.decorator';
import type { JwtPayloadInterface } from '../../common/interfaces/jwt-payload.interface';
import { RefreshAuthGuard } from 'src/common/guards/refresh.guard';
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
  @ApiOperation({ summary: 'Authenticate user and return JWT token' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@User() user: UserPayload,@Req() req: Request,@Res({ passthrough: true }) res: Response): Promise<any> {
    //console.log("AuthController: Received login request for:", user.email);
    //console.log("AuthController: Passing to AuthService.signIn", user);
    return this.authService.login(req, res, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@JwtPayload() jwtPayload: JwtPayloadInterface): Promise<any> {

    console.log("AuthController:................................................");
    console.log(jwtPayload);
    return jwtPayload
  }

  @Post('/refresh')
  @UseGuards(RefreshAuthGuard) // Use the custom refresh token guard
  async refreshToken(jwtPayload: any): Promise<any> {

    console.log("AuthController:................................................");
    console.log(jwtPayload);
    return jwtPayload
  }



  // 3. Logout: POST /auth/logout (Requires JWT)
  //@UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
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
  async deactivate(@Req() req: Request) {
    return this.authService.deactivateUser({} as any);
    
  }

    // 2. Permanent Delete
  //@UseGuards(JwtAuthGuard)
  @Delete('unregister')
  async unregister(@Req() req: Request) {
    return this.authService.unregisterAccount({} as any);
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
  @ApiOperation({ summary: 'Verify user email via token' })
  @ApiQuery({ name: 'token', type: String, description: 'The unique verification hash' }) // This adds it to Swagger
  @Get('verify-email')
  async verifyEmail(@Query('token', TokenValidationPipe)  token: string) {
    // verifyEmailDto.token will contain the token from the URL
    console.log('Received email verification token:', token);
    return await this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  async resendVerification(
    @Body('email', EmailValidationPipe) email: string // Validation happens here
  ) {
    console.log('Validating resend request for:', email);
    return await this.authService.resendVerification(email);
  }
}
//@Res({ passthrough: true }) res: Response