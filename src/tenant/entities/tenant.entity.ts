import { ObjectType, Field, ID } from '@nestjs/graphql';
import CustomBaseEntity from 'src/infra/base-classes/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType('Tenant')
@Entity('tenants')
export default class Tenant {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Field({ description: 'The name of the hospital' })
  name: string;

  @Column({})
  @Field()
  databaseConnectionString: string;

  @Column()
  @Field({description: "The domain of the org"})
  domain: string;
}
