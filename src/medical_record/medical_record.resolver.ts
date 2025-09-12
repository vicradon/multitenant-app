import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MedicalRecordService } from './medical_record.service';
import MedicalRecord from './entities/medical_record.entity';
import { CreateMedicalRecordInput } from './dto/create-medical_record.input';
import { UpdateMedicalRecordInput } from './dto/update-medical_record.input';
import CurrentUser from 'src/auth/decorators/current-user.decorator';
import IUserContext from 'src/auth/interfaces/user-context.interface';

@Resolver(() => MedicalRecord)
export class MedicalRecordResolver {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Mutation(() => MedicalRecord)
  createMedicalRecord(
    @Args('createMedicalRecordInput')
    createMedicalRecordInput: CreateMedicalRecordInput,
    @CurrentUser() userContext: IUserContext,
  ) {
    return this.medicalRecordService.create(createMedicalRecordInput, userContext);
  }

  @Query(() => [MedicalRecord], { name: 'medicalRecord' })
  findAll() {
    return this.medicalRecordService.findAll();
  }

  @Query(() => MedicalRecord, { name: 'medicalRecord' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.medicalRecordService.findOne(id);
  }

  @Mutation(() => MedicalRecord)
  updateMedicalRecord(
    @Args('updateMedicalRecordInput')
    updateMedicalRecordInput: UpdateMedicalRecordInput,
  ) {
    return this.medicalRecordService.update(
      updateMedicalRecordInput.id,
      updateMedicalRecordInput,
    );
  }

  @Mutation(() => MedicalRecord)
  removeMedicalRecord(@Args('id', { type: () => Int }) id: number) {
    return this.medicalRecordService.remove(id);
  }
}
