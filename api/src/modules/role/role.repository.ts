// Auth.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository); // Pass the injected TypeORM repo to the super class
  }

  async findByUserRole(roleName: UserRole): Promise<Role | null> {
    return await this.findOne({ 
        where: { name:roleName },
        relations: ['permissions']});
  }

  
}
