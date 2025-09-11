import { Field, ObjectType, PartialType } from '@nestjs/graphql';

import AuthOutput from './auth.output';

@ObjectType()
export default class LoginOutput extends PartialType(AuthOutput) {
  @Field(() => String, { description: `Success message` })
  message: string;

  @Field(() => String)
  userName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  accessToken?: string;
}
