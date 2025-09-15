import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import User from '../user/entities/user.entity';
import Tenant from '../tenant/entities/tenant.entity';
import MedicalRecord from '../medical_record/entities/medical_record.entity';
import { DataSource } from 'typeorm';

export const sharedEntities = [User, MedicalRecord];

export const getIdentityDataSource = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get('DB_URL_IDENTITY'),
  entities: [Tenant],
  synchronize: true,
  logging: false,
});

export const DynamicDataSource = (connectionString: string): DataSource => {
  return new DataSource({
    type: 'postgres',
    url: connectionString,
    entities: sharedEntities,
    synchronize: true,
  });
};

