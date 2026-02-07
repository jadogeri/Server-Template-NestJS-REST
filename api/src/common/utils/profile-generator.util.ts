import { Profile } from "../../modules/profile/entities/profile.entity";

export class ProfileGeneratorUtil {
  // Utility methods for generating users can be added here

  static generate(payload: any): Profile{
        const profile = new Profile();        
        return profile;

    }
}   