import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const JwtAuthGqlGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export default class JwtAuthGqlGuard extends JwtAuthGqlGuard_base {
    private reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    getRequest(context: ExecutionContext): any;
}
export {};
