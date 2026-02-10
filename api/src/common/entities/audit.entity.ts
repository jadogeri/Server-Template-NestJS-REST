import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Audit extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
