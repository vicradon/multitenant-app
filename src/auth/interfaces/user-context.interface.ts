import { UserRoleEnum } from '../../user/entities/user.entity';

export default interface IUserContext {
  /** The user's unique identifier */
  sub: string;

  /** The user's unique identifier (copy) */
  id?: string;

  /** The user's display name */
  displayName?: string;

  /** The user's email */
  email: string;

  isSuperAdmin?: boolean;

  /** The user's roles */
  roles?: UserRoleEnum[];
}
