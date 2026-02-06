import { Auth } from "../../modules/auth/entities/auth.entity";

export class AuthGeneratorUtil {
  // Utility methods for generating users can be added here

  static generate(payload: any): Auth{
        const auth = new Auth();
        auth.email = payload.email;
        auth.password = payload.password;
        return auth;

    }
}   