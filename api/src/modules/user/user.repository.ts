// user.repository.ts
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRepositoryInterface } from 'src/shared/interfaces/user-repository.interface';
@Injectable()
export class UserRepository extends Repository<User> implements UserRepositoryInterface {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
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
    const user = await this.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
    return user;
  }

  
}
