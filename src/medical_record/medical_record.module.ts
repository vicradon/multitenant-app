import { Module } from '@nestjs/common';
import { MedicalRecordService } from './medical_record.service';
import { MedicalRecordResolver } from './medical_record.resolver';
import DatabaseModule from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MedicalRecordResolver, MedicalRecordService],
})
export class MedicalRecordModule {}
