import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository, FindOneOptions } from 'typeorm';
import IUserContext from '../auth/interfaces/user-context.interface';

import CreateUserInput from './dto/create-user.input';
import User from './entities/user.entity';
import Tenant from 'src/tenant/entities/tenant.entity';
import { TenantConnectionService } from 'src/shared/repository';

@Injectable()
export default class UserService {
  constructor(private readonly tenantConnection: TenantConnectionService) {}

  async findByToken(resetPasswordToken: string, tenant: Tenant) {
    const repository = this.tenantConnection.getRepository(User, tenant);

    return repository.findOne({ where: { resetPasswordToken } });
  }

  async findPasswordByEmail(email: string, tenant: Tenant) {
    const repository = this.tenantConnection.getRepository(User, tenant);

    return repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async findByEmail(email: string, tenant: Tenant) {
    const repository = this.tenantConnection.getRepository(User, tenant);

    return repository
      .createQueryBuilder('user')
      .withDeleted() // Include soft-deleted records
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async findById(id: string, throwException = true, tenant: Tenant) {
    const repository = this.tenantConnection.getRepository(User, tenant);

    const user = await repository.findOne({
      where: { id },
    });

    if (!user && throwException) {
      throw new NotFoundException('User not found aginst given ID');
    }

    return user;
  }

  async create(createUserInput: CreateUserInput) {
    return new User()
    // const identityRepo = this.tenantConnection.getRepository(User, tenant);

    // const { email, password } = createUserInput;

    // const existingRecord = email && (await this.findByEmail(email, tenant));

    // if (existingRecord && !existingRecord.deletedAt) {
    //   throw new ConflictException('Please use different email');
    // }

    // if (existingRecord && existingRecord.deletedAt) {
    //   await repository.remove(existingRecord); // Permanently delete the record
    // }

    // const user = repository.create({
    //   ...createUserInput,
    //   email: email.toLowerCase(),
    //   password: await hash(password, 10),
    // });

    // await repository.save(user);

    // return user;
  }

  async findOneUser(findOptions: FindOneOptions<User>, tenant: Tenant) {
    const repository = this.tenantConnection.getRepository(User, tenant);

    const user = await repository.findOne(findOptions);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async saveUser(user: User, tenant: Tenant) {
    const repository = this.tenantConnection.getRepository(User, tenant);

    await repository.save(user);
    return 'User update successful';
  }
}
