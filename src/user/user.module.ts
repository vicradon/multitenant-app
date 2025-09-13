import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import UserService from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { TenantConnectionService } from 'src/shared/repository';

@Module({
  imports: [TypeOrmModule.forFeature([User], "hospitalA"), TypeOrmModule.forFeature([User], "hospitalB")],
  providers: [UserResolver, UserService, TenantConnectionService],
  exports: [UserService, TypeOrmModule]
})
export default class UserModule {}
