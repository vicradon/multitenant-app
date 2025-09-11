import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export default class LoginInput {
  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;
}
