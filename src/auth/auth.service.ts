import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';

import User, { UserRoleEnum } from '../user/entities/user.entity';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import UserService from 'src/user/user.service';
import LoginInput from './dto/login.input';
import RegisterInput from './dto/register.input';

@Injectable()
export default class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(input: LoginInput) {
    const { email, password } = input;

    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('User email or password incorrect');
    }

    return this.generateAuthToken(user);
  }

  async register(input: RegisterInput) {
    const { email, password, name, adminKey } = input;

    if (adminKey !== this.configService.get('admin.key')) {
      throw new NotFoundException('404');
    }

    const user = await this.userService.create({
      displayName: name,
      email,
      password,
      roles: [UserRoleEnum.STAFF_USER],
      isSuperAdmin: true,
    });

    return this.generateAuthToken(user);
  }

  async generateAuthToken(user: User, extendPayload = true) {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
    };

    if (extendPayload) {
      payload.roles = user.roles;
      payload.displayName = user.displayName;
      payload.isSuperAdmin = user.isSuperAdmin;
    }

    const options = !extendPayload ? { expiresIn: '20m' } : undefined;

    return {
      message: 'Logged in successfully',
      userName: user.displayName,
      email: user.email,
      
      accessToken: this.jwtService.sign(payload, options),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findPasswordByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User Not found');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }
}
