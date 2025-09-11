import { Field, ID, ObjectType } from '@nestjs/graphql';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Base entity class with common audit fields for all database entities.
 * Provides automatic timestamp tracking and soft delete capabilities.
 * Inherits TypeORM's BaseEntity for active record pattern support.
 */
@Entity()
@ObjectType({ isAbstract: true })
export default abstract class CustomBaseEntity extends BaseEntity {
  /**
   * Unique identifier using UUID v4
   * @example "d9ee9c42-1691-4f76-aab3-569abd28aa5d"
   */
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  /**
   * Creation timestamp in UTC timezone
   * Automatically set on entity creation
   */
  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * Last update timestamp in UTC timezone
   * Automatically updated on entity save
   */
  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  /**
   * Soft delete timestamp in UTC timezone
   * Marks entity as deleted when set (nullable by default)
   */
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  /**
   * ID of user who created the entity
   * References User entity ID (nullable if creation isn't user-triggered)
   */
  @Column({ type: 'uuid', nullable: true })
  createdById: string;

  /**
   * ID of user who last updated the entity
   * References User entity ID (nullable if update isn't user-triggered)
   */
  @Column({ type: 'uuid', nullable: true })
  updatedById: string;

  toSnapshot(
    options: { includeId?: boolean } = { includeId: true },
  ): Record<string, any> {
    const snapshot = {};
    const keys = Object.keys(this);

    keys.forEach(key => {
      if (typeof this[key] === 'function') return;
      if (options.includeId === false && key === 'id') return;
      snapshot[key] = this[key];
    });

    return snapshot;
  }
}
