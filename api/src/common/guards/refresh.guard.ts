
import { AuthGuard } from '@nestjs/passport';
import { Guard } from '../decorators/guard.decorator';

@Guard()
export class RefreshAuthGuard extends AuthGuard('refresh') {}