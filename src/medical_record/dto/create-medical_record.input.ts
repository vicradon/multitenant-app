import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMedicalRecordInput {
  @Field()
  patientName: string;

  @Field()
  diagnosis: string;

  @Field()
  doctorName: string;
}
