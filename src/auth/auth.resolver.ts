import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from './decorators/public.decorator';
import LoginOutput from './dto/login.output';
import RegisterInput from './dto/register.input';
import LoginInput from './dto/login.input';
import AuthService from './auth.service';

@Resolver()
export default class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    // dummy query to satisfy @nest/graphql
    @Query(() => String)
    sayAuth(): string {
        return 'Auth!';
    }

    @Public()
    @Mutation(() => LoginOutput, { name: 'login' })
    async login(@Args('loginInput') loginInput: LoginInput) {
        return this.authService.login(loginInput);
    }

    @Public()
    @Mutation(() => LoginOutput, { name: 'register' })
    async register(@Args('registerInput') registerInput: RegisterInput) {
        return this.authService.register(registerInput);
    }
}
