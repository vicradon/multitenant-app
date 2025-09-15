import { ObjectType, Field } from '@nestjs/graphql';
import CustomBaseEntity from '../../infra/base-classes/base.entity';
import { Entity, Column } from 'typeorm';

@Entity()
@ObjectType()
export default class MedicalRecord extends CustomBaseEntity {
  @Column()
  @Field()
  patientName: string;

  @Column()
  @Field()
  diagnosis: string;

  @Column()
  @Field()
  doctorName: string;
}