import { UserRoleEnum } from '../../user/entities/user.entity';
export default interface IUserContext {
    sub: string;
    id?: string;
    displayName?: string;
    email: string;
    isSuperAdmin?: boolean;
    roles?: UserRoleEnum[];
}
