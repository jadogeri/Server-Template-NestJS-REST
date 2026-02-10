
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Added import
import { Profile } from '../../profile/entities/profile.entity';
import { Auth } from '../../auth/entities/auth.entity';
import { Role } from '../../role/entities/role.entity';
import { Audit } from '../../../common/entities/audit.entity';


@Entity("users")
export class User extends Audit {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @Column({ type: 'varchar', length: 100 })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  lastName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;
  
  // Virtual Property
  @ApiProperty({ example: 'John Doe', description: 'The combined first and last name' })
  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true }) 
  // No @JoinColumn here. Cascade still allows user.profile = new Profile() to work.
  profile: Profile;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;

  @ManyToMany(() => Role, (role: Role) => role.users, { cascade: true })
  @JoinTable({ 
    name: 'users_roles',
    joinColumn: {
      name: 'userId',            // The column name for the User ID
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'roleId',            // The column name for the Role ID
      referencedColumnName: 'id'
    }
  })
  roles: Role[];

}