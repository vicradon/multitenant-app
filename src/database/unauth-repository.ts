import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import Tenant from 'src/tenant/entities/tenant.entity';
import { DynamicDataSource } from 'src/db/data-source';

@Injectable()
export class UnauthedDBConnectionService {
  private readonly connectionMap: Map<string, DataSource> = new Map(); // <tenantId>:<DataSource>

  constructor(
    @InjectDataSource() private readonly identityDataSource: DataSource,
  ) {
    console.info('✅ unauthed repository created');
  }

  async getTenantById(tenantId: string): Promise<Tenant | null> {
    if (!tenantId) throw new BadRequestException('Tenant id not provided');

    const tenantRepo = this.identityDataSource.getRepository(Tenant);
    return tenantRepo.findOne({ where: { id: tenantId } });
  }

  getRepositoryFromCache<T extends ObjectLiteral>(
    tenantId: string,
    entity: EntityTarget<T>,
  ): Repository<T> | null {
    if (this.connectionMap.has(tenantId)) {
      console.log('datasource obtained from cached');
      const dataSource = this.connectionMap.get(tenantId);
      return dataSource!.getRepository(entity);
    }

    return null;
  }

  async getRepositoryFromTenantId<T extends ObjectLiteral>(
    tenantId: string,
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    const repository = this.getRepositoryFromCache(tenantId, entity);
    if (repository) return repository;

    /**
     * IF TENANT HAS NOT BEEN INITIALIZED
     */
    const tenant = await this.getTenantById(tenantId);
    if (!tenant)
      throw new BadRequestException('Could not find user from token');

    // for cases where the data source has not been initialized
    const connString = tenant?.databaseConnectionString;
    if (!connString)
      throw new InternalServerErrorException(
        'Could not establish connection with db',
      );

    // initializing the datasource is what allows us to be dynamic
    const dataSource = DynamicDataSource(connString);
    await dataSource.initialize();
    console.log('datasource obtained from initialization');

    this.connectionMap.set(tenant.id, dataSource);
    return dataSource.getRepository(entity);
  }

  async getRepositoryByDomain<T extends ObjectLiteral>(
    domain: string,
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    const tenantRecord = await this.identityDataSource
      .getRepository(Tenant)
      .findOne({ where: { domain } });

    if (!tenantRecord)
      throw new InternalServerErrorException(
        'Could not establish connection with db: tenant not found',
      );

    return this.getRepositoryFromTenantId(tenantRecord.id, entity);
  }

  getIdentityRepository(): Repository<Tenant> {
    return this.identityDataSource.getRepository(Tenant);
  }
}
