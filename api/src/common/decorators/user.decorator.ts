
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../interfaces/user-payload.interface';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: keyof UserPayload | undefined, ctx: ExecutionContext) => {
    const request : Request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);