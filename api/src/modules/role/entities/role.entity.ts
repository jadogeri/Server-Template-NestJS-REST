import { UserRole } from '../../../common/enums/user-role.enum';
import { Permission } from 'src/modules/permission/entities/permission.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';


@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-enum', enum: UserRole, unique: true })
  name: UserRole;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  // Many users can have this role
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission: Permission) => permission.roles)
@JoinTable({
  name: "roles_permissions", // The junction table name
  joinColumn: {
    name: "roleId", // The column for the current entity (Role)
    referencedColumnName: "id"
  },
  inverseJoinColumn: {
    name: "permissionId", // The column for the target entity (Permission)
    referencedColumnName: "id"
  }
})  permissions: Permission[];    
}
