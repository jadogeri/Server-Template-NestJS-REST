import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  }, { message: 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols' })
  password: string;
}



export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Enter a valid email to receive a reset link' })
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsStrongPassword({ minLength: 8 })
  newPassword: string;
}


export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ReactivateDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
