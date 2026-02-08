import { Auth } from "../../../modules/auth/entities/auth.entity";
import { Service } from "../../../common/decorators/service.decorator";


@Service()
export class AccessControlService {
  // We pass the user object directly to avoid calling AuthService inside here
  isUserActive(user: Auth): boolean {
    return user?.isEnabled ;
  }

  isUserVerified(user: Auth): boolean {
    return user?.isVerified;
  }


}
