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
    return tenantRepo.findOneOrFail({ where: { id: tenantId } });
  }

  async getRepositoryByTenant<T extends ObjectLiteral>(
    tenant: Tenant,
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    if (this.connectionMap.has(tenant.id)) {
      console.log('datasource obtained from cached');
      const dataSource = this.connectionMap.get(tenant.id);
      return dataSource!.getRepository(entity);
    }

    // for cases where the data source has not been initialized
    const connString = tenant?.databaseConnectionString;
    if (!connString)
      throw new InternalServerErrorException(
        'Could not establish connection with db',
      );

    // initializing the datasource is what allows us to be dynamic
    const dataSource = DynamicDataSource(connString)
    await dataSource.initialize();
    console.log('datasource obtained from initialization');
    
    this.connectionMap.set(tenant.id, dataSource);
    return dataSource.getRepository(entity);
  }

  async getRepositoryByDomain<T extends ObjectLiteral>(
    domain: string,
    entity: EntityTarget<T>,
  ): Promise<Repository<T>> {
    const tenant = await this.identityDataSource
      .getRepository(Tenant)
      .findOne({ where: { domain } });

    if (!tenant)
      throw new InternalServerErrorException(
        'Could not establish connection with db',
      );

    return this.getRepositoryByTenant(tenant, entity);
  }

  getIdentityRepository(): Repository<Tenant> {
    return this.identityDataSource.getRepository(Tenant);
  }
}
