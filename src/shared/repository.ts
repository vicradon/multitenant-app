import { Injectable } from '@nestjs/common';
import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import Tenant from 'src/tenant/entities/tenant.entity';
import { requestContext } from './request-context';

@Injectable()
export class TenantConnectionService {
  private readonly connectionMap: Record<string, DataSource>;

  constructor(
    @InjectDataSource() private readonly identityDataSource: DataSource,
    @InjectDataSource('hospitalA')
    private readonly hospitalAConnection: DataSource,
    @InjectDataSource('hospitalB')
    private readonly hospitalBConnection: DataSource,
  ) {
    this.connectionMap = {
      hospital_a: hospitalAConnection,
      hospital_b: hospitalBConnection,
    };
  }

  private async getCurrentTenant(): Promise<Tenant> {
    const context = requestContext.getStore();
    if (!context?.tenantId)
      throw new Error('Tenant not found in request context');

    const tenant = await this.identityDataSource
      .getRepository(Tenant)
      .findOne({ where: { id: context.tenantId } });

    if (!tenant) throw new Error('Tenant not found in DB');
    return tenant;
  }

  async getRepository<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
  ): Promise<Repository<Entity>> {
    const tenant = await this.getCurrentTenant();
    const connection = this.connectionMap[tenant.databaseName];
    if (!connection)
      throw new Error(`No connection for tenant ${tenant.databaseName}`);
    return connection.getRepository(entity);
  }

  getRepositoryByTenant<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    tenant: Tenant,
  ): Repository<Entity> {
    const connection = this.connectionMap[tenant.databaseName];
    if (!connection)
      throw new Error(`No connection for tenant ${tenant.databaseName}`);
    return connection.getRepository(entity);
  }

  getIdentityRepository(): Repository<Tenant> {
    return this.identityDataSource.getRepository(Tenant);
  }
}
