import { DataSourceOptions } from 'typeorm';


export const DatabaseConfig = (url: string, migrationsPath: string): DataSourceOptions => ({
    type: 'postgres',
    url,
    migrations: [migrationsPath],
    logging: false,
    synchronize: true,
    cache: { duration: 1000 },
});

export const hospitalADB = DatabaseConfig(
    // process.env.HOSPITAL_A_DB_URL as string,
    "postgresql://hospital_a:hospital_a@localhost:5432/hospital_a",
    'dist/src/db/migrations/hospitalA/*.js'
)

export const hospitalBDB = DatabaseConfig(
    process.env.HOSPITAL_B_DB_URL as string,
    'dist/src/db/migrations/hospitalB/*.js'
)

