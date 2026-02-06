import { Repository } from "typeorm/repository/Repository";
import { Session } from "../../modules/session/entities/session.entity";
import { Auth } from "../../modules/auth/entities/auth.entity";

export interface CustomSSessionRepositoryMethodsInterface {

  findAllByAuth(auth: Auth): Promise<Session[] | null>;
  
}

export interface SessionRepositoryInterface extends Repository<Session>, CustomSSessionRepositoryMethodsInterface {};