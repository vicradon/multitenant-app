import { Seeder } from 'typeorm-extension';
import { hash } from 'bcryptjs';
import Tenant from 'src/tenant/entities/tenant.entity';
import User, { UserRoleEnum } from '../entities/user.entity';
import { DataSource } from 'typeorm';

export default class CreateUsersSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const tenantRepository = dataSource.getRepository(Tenant);

    const tenantA = await tenantRepository.findOne({
      where: { databaseName: 'database_a' },
    });
    const tenantB = await tenantRepository.findOne({
      where: { databaseName: 'database_b' },
    });

    if (!tenantA || !tenantB) {
      throw new Error('Tenants not found');
    }

    const hashedPassword = await hash('12345', 10);

    const users: Partial<User>[] = [
      {
        tenantId: tenantA.id,
        displayName: 'Hospital A User 1',
        email: 'user1@hospital_a.com',
        password: hashedPassword,
        isSuperAdmin: false,
        roles: [UserRoleEnum.STAFF_USER],
      },
      {
        tenantId: tenantA.id,
        displayName: 'Hospital A User 2',
        email: 'user2@hospital_a.com',
        password: hashedPassword,
        isSuperAdmin: true,
        roles: [UserRoleEnum.STAFF_USER],
      },
      {
        tenantId: tenantB.id,
        displayName: 'Hospital B User 1',
        email: 'user1@hospital_b.com',
        password: hashedPassword,
        isSuperAdmin: false,
        roles: [UserRoleEnum.STAFF_USER],
      },
      {
        tenantId: tenantB.id,
        displayName: 'Hospital B User 2',
        email: 'user2@hospital_b.com',
        password: hashedPassword,
        isSuperAdmin: true,
        roles: [UserRoleEnum.STAFF_USER],
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOneBy({ email: userData.email });
      if (!existingUser) {
        const user = userRepository.create(userData);
        await userRepository.save(user);
      }
    }
  }
}
