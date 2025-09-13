import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import User from './entities/user.entity';
import CreateUserInput from './dto/create-user.input';
import { TenantConnectionService } from 'src/shared/repository';
import Tenant from 'src/tenant/entities/tenant.entity';

@Injectable()
export default class UserService {
  constructor(private readonly tenantConnection: TenantConnectionService) {}

  async findByEmail(email: string, tenant: Tenant): Promise<User> {
    const repository = this.tenantConnection.getRepositoryByTenant(
      User,
      tenant,
    );
    const user = await repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(
    createUserInput: CreateUserInput,
    tenant: Tenant,
  ): Promise<User> {
    const repository = this.tenantConnection.getRepositoryByTenant(
      User,
      tenant,
    );

    const { email, password, displayName, roles } = createUserInput;

    const existing = await repository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();

    if (existing && !existing.deletedAt) {
      throw new ConflictException('Email already in use');
    }

    if (existing && existing.deletedAt) {
      await repository.remove(existing); // permanently delete soft-deleted user
    }

    const user = repository.create({
      email: email.toLowerCase(),
      password: await hash(password, 10),
      displayName,
      roles,
    });

    await repository.save(user);

    return user;
  }
}
