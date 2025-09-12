import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryFactory } from 'src/shared/repository';
import Tenant from 'src/tenant/entities/tenant.entity';
import { TenantModule } from 'src/tenant/tenant.module';
import { TenantService } from 'src/tenant/tenant.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    TenantModule
  ],
    providers: [RepositoryFactory],
    exports: [RepositoryFactory]
})
export class DatabaseModule {}
