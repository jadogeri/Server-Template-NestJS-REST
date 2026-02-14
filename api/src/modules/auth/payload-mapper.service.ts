import { UserRole } from "../../common/enums/user-role.enum";
import { Service } from "../../common/decorators/service.decorator";
import { UserPayload } from "../../common/interfaces/user-payload.interface";
import { PermissionStringGeneratorUtil } from "../../common/utils/permission-string.util";
import { User } from "../user/entities/user.entity";
import { PermissionString } from "src/common/types/permission-string.type";

@Service()
export class PayloadMapperService {
  toUserPayload(user: User, email: string): UserPayload {
    const uniquePermissions: PermissionString[] = [
        ...new Set(
            user.roles.flatMap(role => 
            role.permissions.map(p => PermissionStringGeneratorUtil.generate(p.resource, p.action))
            )
        )
    ];
        
    // 2. Implementation (No 'as' needed!)
    const uniqueRoles: UserRole[] = [
    ...new Set(
        user.roles.flatMap(role => 
        role.name)
        )  
    ];

    console.log(`User ${email} has roles:`, uniqueRoles);
    console.log(`User ${email} has permissions:`, uniquePermissions);
    const userPayload: UserPayload = {
      userId: user.id,
      email: email,
      roles: uniqueRoles,
      permissions: uniquePermissions,
    };
    return userPayload;
    
  }
  
}
