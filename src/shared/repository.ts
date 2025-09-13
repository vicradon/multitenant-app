import { Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository, EntityTarget, ObjectLiteral } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import Tenant from 'src/tenant/entities/tenant.entity';

// @Injectable({ scope: Scope.REQUEST })
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

  getRepository<Entity extends ObjectLiteral>(
    entity: EntityTarget<Entity>,
    tenant: Tenant,
  ): Repository<Entity> {
    const connection = this.connectionMap[tenant.databaseName];
    if (!connection)
      throw new Error(`No connection found for tenant ${tenant.databaseName}`);
    return connection.getRepository(entity);
  }

  getIdentityRepository(): Repository<Tenant> {
    return this.identityDataSource.getRepository(Tenant);
  }
}
