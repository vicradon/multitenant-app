import RegisterInput from './dto/register.input';
import LoginInput from './dto/login.input';
import AuthService from './auth.service';
export default class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    sayAuth(): string;
    login(loginInput: LoginInput): Promise<{
        message: string;
        userName: string;
        email: string;
        accessToken: string;
    }>;
    register(registerInput: RegisterInput): Promise<{
        message: string;
        userName: string;
        email: string;
        accessToken: string;
    }>;
}
