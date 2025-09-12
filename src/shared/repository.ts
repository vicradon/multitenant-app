import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository, EntityTarget, FindManyOptions, DeepPartial, ObjectLiteral } from 'typeorm';
import IUserContext from "src/auth/interfaces/user-context.interface";
import { TenantService } from "src/tenant/tenant.service";

type DatabaseName = 'hospitalA' | 'hospitalB'; 

@Injectable()
export class RepositoryFactory {
  constructor(
    @InjectDataSource('hospitalA') private hospitalA: DataSource,
    @InjectDataSource('hospitalB') private hospitalB: DataSource,
    private tenantLookup: TenantService,
  ) {}

  private getDataSource(dbName: string): DataSource {
    switch(dbName) {
      case 'hospital_a': return this.hospitalA;
      case 'hospital_b': return this.hospitalB;
      default:
        throw new BadRequestException(`Database connection '${dbName}' not found`);
    }
  }

  async getRepository<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
    userContext: IUserContext
  ): Promise<Repository<T>> {
    const tenantDb = await this.tenantLookup.getTenantDatabase(userContext.tenantId);
    const dataSource = this.getDataSource(tenantDb);
    return dataSource.getRepository(entity);
  }

  async save<T extends ObjectLiteral>(
    entity: EntityTarget<T>, 
    data: DeepPartial<T>,
    userContext: IUserContext
  ): Promise<T> {
    const repo = await this.getRepository<T>(entity, userContext);
    return repo.save(data);
  }

  async find<T extends ObjectLiteral>(
    entity: EntityTarget<T>, 
    userContext: IUserContext,
    options?: FindManyOptions<T>
  ): Promise<T[]> {
    const repo = await this.getRepository<T>(entity, userContext);
    return repo.find(options);
  }

  async findOne<T extends ObjectLiteral>(
    entity: EntityTarget<T>, 
    userContext: IUserContext,
    options: FindManyOptions<T>
  ): Promise<T | null> {
    const repo = await this.getRepository<T>(entity, userContext);
    return repo.findOne(options as any);
  }

  async update<T extends ObjectLiteral>(
    entity: EntityTarget<T>, 
    userContext: IUserContext,
    criteria: any,
    partialEntity: DeepPartial<T>
  ): Promise<any> {
    const repo = await this.getRepository<T>(entity, userContext);
    return repo.update(criteria, partialEntity as QueryDeepPartialEntity<T>);
  }

  async delete<T extends ObjectLiteral>(
    entity: EntityTarget<T>, 
    userContext: IUserContext,
    criteria: any
  ): Promise<any> {
    const repo = await this.getRepository<T>(entity, userContext);
    return repo.delete(criteria);
  }
}