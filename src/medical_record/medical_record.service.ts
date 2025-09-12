import { Injectable } from '@nestjs/common';
import { CreateMedicalRecordInput } from './dto/create-medical_record.input';
import { UpdateMedicalRecordInput } from './dto/update-medical_record.input';
import MedicalRecord from './entities/medical_record.entity';
import { RepositoryFactory } from 'src/shared/repository';
import IUserContext from 'src/auth/interfaces/user-context.interface';

@Injectable()
export class MedicalRecordService {
  constructor(private repoFactory: RepositoryFactory) {}

  async create(createMedicalRecordInput: CreateMedicalRecordInput, userContext: IUserContext) {
    const record = new MedicalRecord();

    record.diagnosis = 'Fever';
    record.doctorName = 'Dr Hans';
    record.patientName = 'Mr Boi';

    await this.repoFactory.save(MedicalRecord, record, userContext);

    return record
  }

  findAll() {
    return `This action returns all medicalRecord`;
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
