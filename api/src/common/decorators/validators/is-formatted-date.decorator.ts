// src/common/decorators/is-formatted-date.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { parse, isValid } from 'date-fns';

export function IsFormattedDate(format: string = 'dd-MMM-yyyy') {
  return applyDecorators(
    IsNotEmpty({ message: 'Date is required' }),
    Transform(({ value }) => {
      // 1. If not a string, pass through to let @IsDate handle it
      if (typeof value !== 'string') return value;

      // 2. Attempt to parse with the specific format
      const parsedDate = parse(value, format, new Date());

      // 3. Return Date object if valid, else return original string to trigger @IsDate fail
      return isValid(parsedDate) ? parsedDate : value;
    }),
    IsDate({ 
      message: `Date must be in ${format} format (e.g., 05-FEB-2026)` 
    }),
  );
}
