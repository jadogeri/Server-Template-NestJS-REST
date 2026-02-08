import { PipeTransform, BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';
import { Pipe } from '../decorators/pipe.decorator';

@Pipe()
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
