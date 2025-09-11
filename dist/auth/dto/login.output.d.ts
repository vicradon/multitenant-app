import AuthOutput from './auth.output';
declare const LoginOutput_base: import("@nestjs/common").Type<Partial<AuthOutput>>;
export default class LoginOutput extends LoginOutput_base {
    message: string;
    userName: string;
    email: string;
    accessToken?: string;
}
export {};
