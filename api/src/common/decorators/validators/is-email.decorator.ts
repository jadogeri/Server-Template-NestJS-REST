// src/common/decorators/is-user-email.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsUserEmail() {
  return applyDecorators(
    IsNotEmpty({ message: 'Email is required' }),
    // Normalize: Trim whitespace and convert to lowercase automatically
    Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    IsEmail({}, { message: 'Please provide a valid email address' }),
  );
}
