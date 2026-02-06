    
// src/core/repositories/base.repository.ts
import { Repository, FindManyOptions, FindOneOptions, DeepPartial, ObjectLiteral, DeleteResult, QueryDeepPartialEntity, UpdateResult } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findOneById(id: any): Promise<T | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: any, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.repository.update(id, data);
    return this.findOneById(id);
  }


  async delete(id: any): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}