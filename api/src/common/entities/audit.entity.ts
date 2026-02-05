import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

    
  export abstract class Audit {

  @CreateDateColumn()
  createdAt: Date; // Automatically set on insert

  @UpdateDateColumn()
  updatedAt: Date; // Automatically updated on each save()
}
