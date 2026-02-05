import { Repository } from "typeorm/repository/Repository";
import { User } from "src/modules/user/entities/user.entity";

export interface CustomUserRepositoryMethodsInterface {

  findActiveUser(): Promise<User | null>;

//   findByUsername(username: string): Promise<User | null>;

//   findById(id: number): Promise<User | null> ;
  
}

export interface UserRepositoryInterface extends Repository<User>, CustomUserRepositoryMethodsInterface {};