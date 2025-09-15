import { Pool } from 'pg';
import {hash} from 'bcryptjs';
import { DataSource } from 'typeorm';
import { sharedEntities } from './data-source';
import * as dotenv from 'dotenv'

dotenv.config()

const env = {
  db_url_identity: process.env.DB_URL_IDENTITY || '',
  db_url_hospital_a: process.env.DB_URL_HOSPITAL_A || '',
  db_url_hospital_b: process.env.DB_URL_HOSPITAL_B || '',
};

async function seed() {
  const identityDb = new Pool({
    connectionString: env.db_url_identity,
  });

  try {
    await identityDb.query(`TRUNCATE TABLE tenants CASCADE`);

    const tenants = [
      {
        name: 'Hospital A',
        connectionString: env.db_url_hospital_a || '',
        domain: 'hospital_a.com',
      },
      {
        name: 'Hospital B',
        connectionString: env.db_url_hospital_b || '',
        domain: 'hospital_b.com',
      },
    ];

    for (const tenant of tenants) {
      const tenantIdRow = await identityDb.query(
        `INSERT INTO tenants ("name", "databaseConnectionString", "domain")
        VALUES ($1, $2, $3)
        RETURNING id 
        `,
        [tenant.name, tenant.connectionString, tenant.domain],
      );

      const tenantId = tenantIdRow.rows[0].id


      const dataSource = new DataSource({
        type: 'postgres',
        url: tenant.connectionString,
        entities: sharedEntities,
        synchronize: true,
      });

      await dataSource.initialize();

      // Connect to tenant database
      const tenantPool = new Pool({
        connectionString: tenant.connectionString,
      });

      // Insert users
      const users = [
        {
          displayName: `${tenant.name} User 1`,
          email: `user1@${tenant.domain}`,
          password: '12345',
          tenantId,
        },
        {
          displayName: `${tenant.name} User 2`,
          email: `user2@${tenant.domain}`,
          password: '12345',
          tenantId,
        },
      ];

      await tenantPool.query('TRUNCATE TABLE users CASCADE');
      for (const user of users) {
        const hashedPassword = await hash(user.password, 10);
        await tenantPool.query(
          `INSERT INTO users ("displayName", "email", "password", "tenantId")
           VALUES ($1, $2, $3, $4)`,
          [user.displayName, user.email, hashedPassword, tenantId],
        );
      }

      const medicalRecords = [
        {
          diagnosis: 'Fever',
          doctorName: 'Dr. Hans',
          patientName: 'Sandra Sully',
          hospital: tenants[0],
        },
        {
          diagnosis: 'Broken Arm',
          doctorName: 'Dr. Maria Rodriguez',
          patientName: 'John Doe',
          hospital: tenants[1],
        },
        {
          diagnosis: 'Concussion',
          doctorName: 'Dr. Lee',
          patientName: 'Emily Chen',
          hospital: tenants[0],
        },
        {
          diagnosis: 'Appendicitis',
          doctorName: 'Dr. Patel',
          patientName: 'David Kim',
          hospital: tenants[0],
        },
        {
          diagnosis: 'Food Poisoning',
          doctorName: 'Dr. Sophia Jensen',
          patientName: 'Olivia Brown',
          hospital: tenants[1],
        },
      ];

      await tenantPool.query('TRUNCATE TABLE medical_record CASCADE');
      for (const record of medicalRecords) {
        if (tenant.domain === record.hospital.domain) {
          await tenantPool.query(
            `INSERT INTO medical_record ("doctorName", "patientName", "diagnosis")
                VALUES ($1, $2, $3)`,
            [record.doctorName, record.patientName, record.diagnosis],
          );
        }
      }

      await tenantPool.end();
    }

    console.log('Seeding complete ✅');
  } catch (err: any) {
    console.error('Seeding failed ❌', err);
  } finally {
    await identityDb.end();
  }
}

seed();
