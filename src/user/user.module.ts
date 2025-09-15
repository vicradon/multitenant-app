import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import UserService from './user.service';
import DatabaseModule from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserResolver, UserService],
  exports: [UserService]
})
export default class UserModule {}
