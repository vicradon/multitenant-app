import { UserRoleEnum } from '../entities/user.entity';
export default class CreateUserInput {
    displayName: string;
    email: string;
    password: string;
    isSuperAdmin?: boolean;
    roles: UserRoleEnum[];
}
