import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthModule from './auth/auth.module';
import { MedicalRecordModule } from './medical_record/medical_record.module';
import UserModule from './user/user.module';
import User from './user/entities/user.entity';
import Tenant from './tenant/entities/tenant.entity';
import { filterEntities } from './utils/glob';
import MedicalRecord from './medical_record/entities/medical_record.entity';
import { DatabaseModule } from './database/database.module';
import { TenantModule } from './tenant/tenant.module';
import { RedisModule } from '@nestjs-modules/ioredis';

const sharedEntities = filterEntities(['user.entity', 'base.entity']);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get("REDIS_URL"),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL_IDENTITY'),
        entities: [Tenant, User],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'hospitalA',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL_HOSPITAL_A'),
        entities: [MedicalRecord],
        synchronize: true,
        logging: false,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: 'hospitalB',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL_HOSPITAL_B'),
        entities: [MedicalRecord],
        synchronize: true,
        logging: false,
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      // @ts-ignore
      useFactory: async () => {
        return {
          csrfPrevention: false,
          playground: false,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context: ({ req, res }) => ({ req, res }),
        };
      },
    }),

    DatabaseModule,
    AuthModule,
    MedicalRecordModule,
    UserModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
