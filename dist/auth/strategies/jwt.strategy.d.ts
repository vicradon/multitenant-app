import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';
import IUserContext from '../interfaces/user-context.interface';
declare const JwtAuthStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export default class JwtAuthStrategy extends JwtAuthStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: IJwtPayload): Promise<IUserContext>;
}
export {};
