import { User } from "../../modules/user/entities/user.entity";

export class UserGeneratorUtil {
  // Utility methods for generating users can be added here

  static generate(payload: any): User{
        const user = new User();
        user.firstName = payload.firstName;
        user.lastName = payload.lastName;
        user.dateOfBirth = payload.dateOfBirth;        
        return user;

    }
}   