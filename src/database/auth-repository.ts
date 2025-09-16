import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import Tenant from 'src/tenant/entities/tenant.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UnauthedDBConnectionService } from './unauth-repository';
import IUserContext from 'src/auth/interfaces/user-context.interface';
import { CONTEXT, GqlContextType } from '@nestjs/graphql';

/**
 * This injectable is created on every request where it is used due to the scope
 * This means no actual persistent connections should happen here
 */
@Injectable({ scope: Scope.REQUEST })
export class AuthedDBConnectionService {
  constructor(
    @InjectDataSource() private readonly identityDataSource: DataSource,
    @Inject(CONTEXT) private context: GqlContextType,
    private readonly unauthedRepoService: UnauthedDBConnectionService,
  ) {
    console.info('☑️  authed db repository created');
  }

  getIdentityRepository(): Repository<Tenant> {
    return this.identityDataSource.getRepository(Tenant);
  }

  async getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    const requestObject = this.context['req'] as Request;
    const currentUserContext = requestObject?.user as IUserContext;

    const repo = await this.unauthedRepoService.getRepositoryFromTenantId(
      currentUserContext.tenantId,
      entity,
    );

    return repo;
  }

  getUserContext(): IUserContext {
    const requestObject = this.context['req'] as Request;
    return requestObject?.user as IUserContext;
  }
}
