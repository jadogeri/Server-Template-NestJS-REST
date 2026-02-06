import { Repository } from "typeorm/repository/Repository";
import { Auth } from "../../modules/auth/entities/auth.entity";

export interface CustomAuthRepositoryMethodsInterface {

  findByEmail(email: string): Promise<Auth | null>; 

  
}

export interface AuthRepositoryInterface extends Repository<Auth>, CustomAuthRepositoryMethodsInterface {};