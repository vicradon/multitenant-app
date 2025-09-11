import User from './entities/user.entity';
import CreateUserInput from './dto/create-user.input';
import UserService from './user.service';
export declare class UserResolver {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserInput: CreateUserInput): Promise<User>;
}
