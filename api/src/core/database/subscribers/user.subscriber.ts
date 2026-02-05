import { Role } from "../../../modules/role/entities/role.entity";
import { User } from "../../../modules/user/entities/user.entity";
import { UserRole } from "../../../common/enums/user-role.enum";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    
  listenTo() { return User; }

  async beforeInsert(event: InsertEvent<User>) {
    console.log('UserSubscriber beforeInsert triggered..................................');
    const { entity, manager } = event;
    if (!entity.roles || entity.roles.length === 0) {
      const roleRepo = manager.getRepository(Role);
      const defaultRole = await roleRepo.findOneBy({ name: UserRole.USER });
      if (defaultRole) {
        entity.roles = [defaultRole];
      }
    }
  }
}
