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
import { TenantModule } from './tenant/tenant.module';
import { getIdentityDataSource } from './db/data-source';
import DatabaseModule from './database/database.module';
import type { Request, Response } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getIdentityDataSource,
    }),
    AuthModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async () => {
        return {
          csrfPrevention: false,
          playground: false,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,

          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          context: ({ req, res }: { req: Request; res: Response }) => {
            return { req, res };
          },
        };
      },
    }),
    DatabaseModule,
    MedicalRecordModule,
    UserModule,
    TenantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
