import { Injectable } from '@nestjs/common';
import { CreateMedicalRecordInput } from './dto/create-medical_record.input';
import { UpdateMedicalRecordInput } from './dto/update-medical_record.input';
import MedicalRecord from './entities/medical_record.entity';
import { RepositoryFactory } from 'src/shared/repository';
import IUserContext from 'src/auth/interfaces/user-context.interface';

@Injectable()
export class MedicalRecordService {
  constructor(private repoFactory: RepositoryFactory) {}

  async create(
    createMedicalRecordInput: CreateMedicalRecordInput,
    userContext: IUserContext,
  ) {
    const record = new MedicalRecord();

    record.diagnosis = createMedicalRecordInput.diagnosis;
    record.doctorName = createMedicalRecordInput.doctorName;
    record.patientName = createMedicalRecordInput.patientName;

    await this.repoFactory.save(MedicalRecord, record, userContext);

    return record;
  }

  async findAll(userContext: IUserContext) {
    return await this.repoFactory.find(MedicalRecord, userContext);
  }

  findOne(id: number) {
    return `This action returns a #${id} medicalRecord`;
  }

  update(id: number, updateMedicalRecordInput: UpdateMedicalRecordInput) {
    return `This action updates a #${id} medicalRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} medicalRecord`;
  }
}
