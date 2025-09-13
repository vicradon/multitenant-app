import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import User from '../user/entities/user.entity';
import Tenant from '../tenant/entities/tenant.entity';
import MedicalRecord from '../medical_record/entities/medical_record.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const sharedEntities = [User, MedicalRecord];

export const getIdentityDataSource = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get('DB_URL_IDENTITY'),
  entities: [Tenant],
  synchronize: true,
});

export const getHospitalADataSource = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get('DB_URL_HOSPITAL_A'),
  entities: sharedEntities,
  synchronize: true,
  logging: false,
});

export const getHospitalBDataSource = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get('DB_URL_HOSPITAL_B'),
  entities: sharedEntities,
  synchronize: true,
  logging: false,
});


const tenantDatabases = [
  process.env.DB_URL_HOSPITAL_A,
  process.env.DB_URL_HOSPITAL_B,
];


export const getSeederDataSources = (): DataSource[] => {
  return tenantDatabases.map((dbUrl) => {
    const options: DataSourceOptions & SeederOptions = {
      type: 'postgres',
      url: dbUrl,
      entities: [Tenant, ...sharedEntities],
      synchronize: true,
      logging: false,
      seeds: ['src/database/seeders/**/*{.ts,.js}'],
      factories: ['src/database/factories/**/*{.ts,.js}'],
    };
    return new DataSource(options);
  });
};