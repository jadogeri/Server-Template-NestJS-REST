import { Auth } from "../../auth/entities/auth.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  refreshTokenHash: string; // Hash this for security!

  @Column()
  expiresAt: Date;

  @Column()
  @CreateDateColumn()  
  createdAt: Date;

  @ManyToOne(() => Auth, (auth) => auth.sessions, { onDelete: 'CASCADE' })
  auth: Auth;
}
