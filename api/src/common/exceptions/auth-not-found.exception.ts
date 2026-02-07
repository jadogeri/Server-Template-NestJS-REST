import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthNotFoundException extends HttpException {
  constructor(value: string, mode: string) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: 'Auth Not Found',
        message: `The auth using ${getAttribute(mode)} '${value}' does not exist in the database.`,
      },
      HttpStatus.NOT_FOUND,
    );
  }


}
  const getAttribute =  (mode: string) : string => {
    switch (mode) {
      case 'email':
        return 'email';
      case 'id':
        return 'id';
      default:
        return 'unknown';
    }

  }