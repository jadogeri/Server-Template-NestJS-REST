import { Auth } from "../../../modules/auth/entities/auth.entity";
import { Service } from "../../../common/decorators/service.decorator";


@Service()
export class AccessControlService {
  // We pass the user object directly to avoid calling AuthService inside here
  isUserActive(auth: Auth): boolean {
    return auth?.isEnabled ;
  }

  isUserVerified(auth: Auth): boolean {
    return auth?.isVerified;
  }


}
