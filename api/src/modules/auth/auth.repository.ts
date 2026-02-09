// Auth.repository.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '../../common/repositories/base.repository';
@Injectable()
export class AuthRepository extends BaseRepository<Auth> {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {
    super(authRepository); // Pass the injected TypeORM repo to the super class
  }

  // Add domain-specific methods
  async findByEmail(email: string) {
    return this.findOne({ 
      where: { email } as any ,
      relations: ['user', 'user.roles', 'user.roles.permissions'], // Eager load the related User entity and nested relations
    });
  }
}
