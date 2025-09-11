import { DataSourceOptions } from 'typeorm';
export declare const DatabaseConfig: (url: string, migrationsPath: string) => DataSourceOptions;
export declare const hospitalADB: DataSourceOptions;
export declare const hospitalBDB: DataSourceOptions;
