import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import IUserContext from '../interfaces/user-context.interface';
import { Request } from 'express';

@Injectable()
export default class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: IJwtPayload): Promise<IUserContext> {
    const { sub, displayName, email, roles, tenantId } = payload;

    request['tenantId'] = payload.tenantId;

    return {
      id: sub,
      sub,
      displayName,
      tenantId,
      email,
      roles,
    };
  }
}
