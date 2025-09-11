import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import AuthService from './auth.service';
import UserModule from 'src/user/user.module';
import AuthResolver from './auth.resolver';
import JwtAuthStrategy from './strategies/jwt.strategy';
import JwtAuthGqlGuard from './guards/jwt-auth-gql.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGqlGuard,
    },
  ],
  exports: [AuthService],
})
export default class AuthModule { }
