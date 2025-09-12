import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTenantInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
