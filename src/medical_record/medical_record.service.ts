import { Injectable } from '@nestjs/common';
import { CreateMedicalRecordInput } from './dto/create-medical_record.input';
import { UpdateMedicalRecordInput } from './dto/update-medical_record.input';
import MedicalRecord from './entities/medical_record.entity';
import { TenantConnectionService } from 'src/shared/repository';

@Injectable()
export class MedicalRecordService {
  constructor(private readonly tenantConnection: TenantConnectionService) {}

  async create(createMedicalRecordInput: CreateMedicalRecordInput) {
    const repo = await this.tenantConnection.getRepository(MedicalRecord);

    const record = repo.create({
      diagnosis: createMedicalRecordInput.diagnosis,
      doctorName: createMedicalRecordInput.doctorName,
      patientName: createMedicalRecordInput.patientName,
    });

    await repo.save(record);
    return record;
  }

  async findAll() {
    const repo = await this.tenantConnection.getRepository(MedicalRecord);
    return repo.find();
  }

  async findOne(id: string) {
    const repo = await this.tenantConnection.getRepository(MedicalRecord);
    return repo.findOne({ where: { id } });
  }

  async update(id: string, updateInput: UpdateMedicalRecordInput) {
    const repo = await this.tenantConnection.getRepository(MedicalRecord);
    const record = await repo.findOne({ where: { id } });
    if (!record) throw new Error('Record not found');

    Object.assign(record, updateInput);
    await repo.save(record);
    return record;
  }

  async remove(id: string) {
    const repo = await this.tenantConnection.getRepository(MedicalRecord);
    const record = await repo.findOne({ where: { id } });
    if (!record) throw new Error('Record not found');

    await repo.remove(record);
    return  'Record removed';
  }
}
