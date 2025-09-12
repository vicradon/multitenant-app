import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecordService } from './medical_record.service';
import { MedicalRecordResolver } from './medical_record.resolver';
import MedicalRecord  from './entities/medical_record.entity'; 

@Module({
  imports: [],
  providers: [MedicalRecordResolver, MedicalRecordService],
})
export class MedicalRecordModule {}
