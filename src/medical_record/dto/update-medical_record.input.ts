import { CreateMedicalRecordInput } from './create-medical_record.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMedicalRecordInput extends PartialType(CreateMedicalRecordInput) {
  @Field(() => String)
  id: string;
}
