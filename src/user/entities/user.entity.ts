import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import CustomBaseEntity from 'src/infra/base-classes/base.entity';
import Tenant from 'src/tenant/entities/tenant.entity';

import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum UserRoleEnum {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STAFF_USER = 'STAFF_USER',
}

registerEnumType(UserRoleEnum, {
  name: 'UserRoles',
  description: 'The Type of roles a user can have',
});

@ObjectType('User')
@Entity('users')
export default class User extends CustomBaseEntity {
  @Field({ nullable: false })
  @Column()
  displayName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ select: false })
  password: string;

  @Field({ nullable: true })
  @Column({ default: false })
  isSuperAdmin: boolean;

  @Field(() => [UserRoleEnum], { nullable: true })
  @Column({ type: 'enum', enum: UserRoleEnum, array: true, nullable: true })
  roles: UserRoleEnum[];

  @Column({ default: null })
  @Field({ nullable: true })
  resetPasswordToken: string;

  @Column({ default: null })
  @Field({ nullable: true })
  resetPasswordTokenExpiry: Date;

  @Column({ default: null })
  @Field({ nullable: true })
  forgetPasswordToken: string;

  @Column()
  tenantId: string;

  // many users -> one tenant
  // @Field(() => Tenant, { nullable: true })
  // @JoinColumn({ name: 'tenantId' })
  // @ManyToOne(() => Tenant, { eager: true, nullable: false })
  // tenant: Tenant;
}
