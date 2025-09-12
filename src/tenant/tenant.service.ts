import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Tenant from './entities/tenant.entity';

@Injectable()
export class TenantService {
  private readonly CACHE_PREFIX = 'tenant:db:';
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    @InjectRepository(Tenant) private tenantRepo: Repository<Tenant>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async getTenantDatabase(tenantId: string): Promise<string> {
    const cacheKey = `${this.CACHE_PREFIX}${tenantId}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const tenant = await this.tenantRepo.findOne({
      where: { id: tenantId },
      select: ['id', 'databaseName']
    });

    if (!tenant || !tenant.databaseName) {
      throw new BadRequestException(`Invalid or inactive tenant ID: ${tenantId}`);
    }

    await this.redis.setex(cacheKey, this.CACHE_TTL, tenant.databaseName);

    return tenant.databaseName;
  }

  // Cache invalidation when tenant config changes
  async invalidateCache(tenantId: string): Promise<void> {
    const cacheKey = `${this.CACHE_PREFIX}${tenantId}`;
    await this.redis.del(cacheKey);
  }

  // Preload frequently used tenants
  async preloadCache(tenantIds: string[]): Promise<void> {
    const tenants = await this.tenantRepo.find({
      where: { id: In(tenantIds) },
      select: ['id', 'databaseName']
    });

    const pipeline = this.redis.pipeline();
    
    tenants.forEach(tenant => {
      const cacheKey = `${this.CACHE_PREFIX}${tenant.id}`;
      pipeline.setex(cacheKey, this.CACHE_TTL, tenant.databaseName);
    });

    await pipeline.exec();
  }
}