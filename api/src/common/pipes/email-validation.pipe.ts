import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      throw new BadRequestException('Email is required');
    }

    if (!isEmail(value)) {
      throw new BadRequestException('Invalid email format');
    }

    return value.toLowerCase().trim(); // Sanitize the input
  }
}
