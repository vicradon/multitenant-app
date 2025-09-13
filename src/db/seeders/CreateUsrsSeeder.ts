import { Seeder } from 'typeorm-extension';
import { hash } from 'bcryptjs';
import User, { UserRoleEnum } from '../../user/entities/user.entity';
import Tenant from '../../tenant/entities/tenant.entity';
import { DataSource } from 'typeorm';

export default class CreateUsersSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const tenantRepo = dataSource.getRepository(Tenant);
    const userRepo = dataSource.getRepository(User);

    // Fetch all tenants from the database
    const tenants = await tenantRepo.find();

    if (!tenants.length) throw new Error('No tenants found for seeding.');

    const password = await hash('12345', 10);

    for (const tenant of tenants) {
      const users = [
        {
          tenantId: tenant.id,
          displayName: `${tenant.databaseName} User 1`,
          email: `user1@${tenant.databaseName}.com`,
          password,
          roles: [UserRoleEnum.STAFF_USER],
          isSuperAdmin: false,
        },
        {
          tenantId: tenant.id,
          displayName: `${tenant.databaseName} User 2`,
          email: `user2@${tenant.databaseName}.com`,
          password,
          roles: [UserRoleEnum.STAFF_USER],
          isSuperAdmin: true,
        },
      ];

      for (const user of users) {
        const existing = await userRepo.findOneBy({ email: user.email });
        if (!existing) await userRepo.save(user);
      }
    }
  }
}
