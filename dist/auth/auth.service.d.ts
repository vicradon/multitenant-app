import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import User from '../user/entities/user.entity';
import UserService from 'src/user/user.service';
import LoginInput from './dto/login.input';
import RegisterInput from './dto/register.input';
export default class AuthService {
    private userService;
    private configService;
    private jwtService;
    constructor(userService: UserService, configService: ConfigService, jwtService: JwtService);
    login(input: LoginInput): Promise<{
        message: string;
        userName: string;
        email: string;
        accessToken: string;
    }>;
    register(input: RegisterInput): Promise<{
        message: string;
        userName: string;
        email: string;
        accessToken: string;
    }>;
    generateAuthToken(user: User, extendPayload?: boolean): Promise<{
        message: string;
        userName: string;
        email: string;
        accessToken: string;
    }>;
    validateUser(email: string, password: string): Promise<User>;
}
