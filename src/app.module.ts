import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MedicalRecordModule } from './medical_record/medical_record.module';

@Module({
  imports: [AuthModule, MedicalRecordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
