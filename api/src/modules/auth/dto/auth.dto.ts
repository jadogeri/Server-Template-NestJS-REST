import { IsNotEmpty, IsString } from 'class-validator';
import { IsUserEmail } from '../../../common/decorators/validators/is-email.decorator'; 
import { IsFormattedDate } from '../../../common/decorators/validators/is-formatted-date.decorator';
import { IsSecuredPassword } from '../../../common/decorators/validators/is-secured-password.decorator';
import { IsName } from '../../../common/decorators/validators/is-name.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @IsName('FirstName')
  firstName: string;

  @IsName('LastName')
  lastName: string;

  @IsUserEmail()
  email: string;

  @IsSecuredPassword()
  password: string;

  /// Use date-fns to strictly parse the custom format
  @IsFormattedDate('dd-MMM-yyyy')
  dateOfBirth: Date;
}



export class LoginDto {
  @IsUserEmail()
  email: string;

  @IsSecuredPassword()
  password: string;
}

export class ForgotPasswordDto {
  @IsUserEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsSecuredPassword()
  newPassword: string;
}


export class VerifyEmailDto {
  @ApiProperty({ 
    description: 'The unique verification hash',
    example: '92b7a96fd0d31d7e4ae908e82eff6fb19e422eb0' 
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ReactivateDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

