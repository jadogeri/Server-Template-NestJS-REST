    
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

  // async update(id: any, data: QueryDeepPartialEntity<T>): Promise<T | null> {
  //   await this.repository.update(id, data);
  //   return this.findOneById(id);
  // }

  // src/core/repositories/base.repository.ts

async update(id: any, data: QueryDeepPartialEntity<T>): Promise<T | null> {
  console.log(`Updating entity with ID ${id} using data:`, data);
  // 1. Merge existing entity with new data
  // 'preload' looks up the entity by ID and maps the new data onto it
  const entityToUpdate = await this.repository.preload({
    id,
    ...data,
  } as any);

  if (!entityToUpdate) {
    console.warn(`Entity with ID ${id} not found for update.`);
    return null;
  }

  // 2. Save returns the updated entity
  const savedData = await this.repository.save(entityToUpdate);
  console.log(`Updated entity with ID ${id}:`, savedData);
  return savedData;
}



  async delete(id: any): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }
}