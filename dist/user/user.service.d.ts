import { Repository, FindOneOptions } from 'typeorm';
import IUserContext from '../auth/interfaces/user-context.interface';
import CreateUserInput from './dto/create-user.input';
import User from './entities/user.entity';
export default class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findByToken(resetPasswordToken: string): Promise<User | null>;
    findPasswordByEmail(email: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string, throwException?: boolean): Promise<User | null>;
    create(createUserInput: CreateUserInput, userCtx?: IUserContext): Promise<User>;
    findOneUser(findOptions: FindOneOptions<User>): Promise<User>;
    saveUser(user: User): Promise<string>;
}
