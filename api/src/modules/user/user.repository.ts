// Auth.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository); // Pass the injected TypeORM repo to the super class
  }

  // Add your custom method here
  async findActiveUser(): Promise<User | null> {
    return this.findOne({  });
  }

  // Add more custom methods as needed
  async findByFirstName(firstName: string): Promise<User | null> {
    return this.findOne({ where: { firstName } });
  }

  async findByUserId(userId: number): Promise<User | null> {
    const user = await this.findOneById({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
    return user;
  }
  
}
