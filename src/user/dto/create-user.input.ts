import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

import { UserRoleEnum } from '../entities/user.entity';

@InputType()
export default class CreateUserInput {
  @Field()
  @IsNotEmpty()
  displayName: string;

  @Field()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsOptional()
  isSuperAdmin?: boolean;

  @Field(() => [UserRoleEnum], { nullable: true })
  roles: UserRoleEnum[];
}
