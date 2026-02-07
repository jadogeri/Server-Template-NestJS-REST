import { Role } from "../../../modules/role/entities/role.entity";
import { User } from "../../../modules/user/entities/user.entity";
import { UserRole } from "../../../common/enums/user-role.enum";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { RoleNotFoundException } from "../../../common/exceptions/role-not-found.exception";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() { return User; }

  async afterInsert(event: InsertEvent<User>) {
    const { entity, manager } = event;

    // Fallback: If no roles were assigned by the service
    if (!entity.roles || entity.roles.length === 0) {
      const roleRepo = manager.getRepository(Role);
      
      const defaultRole = await roleRepo.findOne({
        where: { name: UserRole.USER }
      });

      if (defaultRole) {
        // Use the Relation Mapper to specifically target the join table
        await manager
          .createQueryBuilder()
          .relation(User, "roles")
          .of(entity)
          .add(defaultRole);
        
        console.log(`Fallback: Assigned ${UserRole.USER} to User ${entity.id}`);
      }else {
        console.warn(`Fallback: Default role ${UserRole.USER} not found. No role assigned to User ${entity.id}`);
        throw new RoleNotFoundException(UserRole.USER);
      }
    }
  }
}
