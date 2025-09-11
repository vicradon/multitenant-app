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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: "postgresql://hospital_a:hospital_a@localhost:5432/hospital_a",
    //   entities: ['./dist/**/*entity.{ts,js}'],
    //   synchronize: true,
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // name: 'hospitalA',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL_HOSPITAL_A'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // name: 'hospitalB',
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DB_URL_HOSPITAL_B'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
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

    AuthModule,
    MedicalRecordModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
