import { BaseEntity } from 'typeorm';
export default abstract class CustomBaseEntity extends BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    createdById: string;
    updatedById: string;
    toSnapshot(options?: {
        includeId?: boolean;
    }): Record<string, any>;
}
