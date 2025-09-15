import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import User from './entities/user.entity';
import CreateUserInput from './dto/create-user.input';
import { UnauthedDBConnectionService } from 'src/database/unauth-repository';
import Tenant from 'src/tenant/entities/tenant.entity';
// import { AuthedDBConnectionService } from 'src/database/auth-repository';

@Injectable()
export default class UserService {
  constructor(
    private readonly unauthedDBConnection: UnauthedDBConnectionService,
    // private readonly authedDBConnection: AuthedDBConnectionService, // this won't work
  ) {}

  extractDomainFromEmail(email: string) {
    if (!email) throw new BadRequestException('No email provided');

    const splitEmail = email.split('@');
    if (splitEmail.length <= 1)
      throw new BadRequestException('Not a valid email');

    return splitEmail[1];
  }

  async findByEmail(email: string): Promise<User> {
    const domain = this.extractDomainFromEmail(email);

    const userRepo =
      await this.unauthedDBConnection.getRepositoryByDomain<User>(domain, User);

    const user = await userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(
    createUserInput: CreateUserInput,
    tenant: Tenant,
  ): Promise<User> {
    const domain = this.extractDomainFromEmail(createUserInput.email);

    const userRepo =
      await this.unauthedDBConnection.getRepositoryByDomain<User>(domain, User);

    if (!userRepo) throw new BadRequestException('Repository not initialized');

    const { email, password, displayName, roles } = createUserInput;

    const existing = await userRepo
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();

    if (existing && !existing.deletedAt) {
      throw new ConflictException('Email already in use');
    }

    const user = userRepo.create({
      email: email.toLowerCase(),
      password: await hash(password, 10),
      displayName,
      roles,
    });

    await userRepo.save(user);

    return user;
  }

  // async findCurrent(): Promise<User | null> {
  //   const userRepo = await this.authedDBConnection.getRepository(User);
  //   const userContext = this.authedDBConnection.getUserContext();
  //   return userRepo.findOneBy({ email: userContext.email });
  // }
}
