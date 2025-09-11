import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export default class RegisterInput {
  @IsEmail()
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  adminKey: string;
}
