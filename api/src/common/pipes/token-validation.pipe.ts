import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TokenValidationPipe implements PipeTransform {
  transform(value: any) {
    // 1. Basic check: Is it missing?
    if (!value) {
      throw new BadRequestException('Verification token is required');
    }

    // 2. Custom Logic: e.g., check length or format (JWT-ish check)
    if (typeof value !== 'string' || value.length < 20) {
      throw new BadRequestException('Invalid token format');
    }

    return value;
  }
}
