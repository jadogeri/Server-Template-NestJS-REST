
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';

export const JwtPayload = createParamDecorator(
  (data: keyof JwtPayloadInterface | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Logic: Look at .user, but your code treats it as the JWT payload
    const payload = request.user; 
    return data ? payload?.[data]  : payload as JwtPayloadInterface;
  },
);
