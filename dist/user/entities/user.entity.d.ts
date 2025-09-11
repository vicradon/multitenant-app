import CustomBaseEntity from 'src/infra/base-classes/base.entity.shared';
export declare enum UserRoleEnum {
    SUPER_ADMIN = "SUPER_ADMIN",
    STAFF_USER = "STAFF_USER"
}
export default class User extends CustomBaseEntity {
    displayName: string;
    email: string;
    password: string;
    isSuperAdmin: boolean;
    roles: UserRoleEnum[];
    resetPasswordToken: string;
    resetPasswordTokenExpiry: Date;
    forgetPasswordToken: string;
}
