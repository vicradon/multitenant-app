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


@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByToken(resetPasswordToken: string) {
    return this.userRepository.findOne({ where: { resetPasswordToken } });
  }

  async findPasswordByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async findByEmail(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .withDeleted() // Include soft-deleted records
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async findById(id: string, throwException = true) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user && throwException) {
      throw new NotFoundException('User not found aginst given ID');
    }

    return user;
  }

  async create(createUserInput: CreateUserInput, userCtx?: IUserContext) {
    const { email, password } = createUserInput;

    const existingRecord = email && (await this.findByEmail(email));

    if (existingRecord && !existingRecord.deletedAt) {
      throw new ConflictException('Please use different email');
    }

    if (existingRecord && existingRecord.deletedAt) {
      await this.userRepository.remove(existingRecord); // Permanently delete the record
    }

    const user = this.userRepository.create({
      ...createUserInput,
      email: email.toLowerCase(),
      password: await hash(password, 10),
    });

    await this.userRepository.save(user);

    return user;
  }

  async findOneUser(findOptions: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(findOptions);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async saveUser(user: User) {
    await this.userRepository.save(user);
    return 'User update successful';
  }
}
