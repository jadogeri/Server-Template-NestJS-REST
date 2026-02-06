// is-secure-password.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { IsStrongPassword, MinLength,  } from 'class-validator';

export function IsSecuredPassword() {
  return applyDecorators(
    // Message 1: Specifically for length
    MinLength(8, { message: 'Password is too short (min 8 characters)' }),    
    
    // Message 2: Specifically for complexity
    IsStrongPassword(
      { minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
      { message: 'Password must include uppercase, lowercase, numbers, and symbols' }
    ),
  );
}
