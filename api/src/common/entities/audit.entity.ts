import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

    
  export abstract class Audit {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date; // Automatically set on insert

  @UpdateDateColumn()
  updatedAt: Date; // Automatically updated on each save()
}
