
import { AuthGuard } from '@nestjs/passport';
import { Guard } from '../decorators/guard.decorator';

@Guard()
export class JwtAuthGuard extends AuthGuard('jwt') {}