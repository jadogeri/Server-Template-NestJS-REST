import { Repository } from "typeorm/repository/Repository";
import { Session } from "../../core/session/entities/session.entity";
import { Auth } from "../../core/auth/entities/auth.entity";

export interface CustomSSessionRepositoryMethodsInterface {

  findAllByAuth(auth: Auth): Promise<Session[] | null>;
  
}

export interface SessionRepositoryInterface extends Repository<Session>, CustomSSessionRepositoryMethodsInterface {};