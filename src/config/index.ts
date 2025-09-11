import * as dotenv from 'dotenv';
import { DatabaseConfig, hospitalADB, hospitalBDB } from './db.config';

dotenv.config();

interface Config {
    hospitalADB: ReturnType<typeof DatabaseConfig>;
    hospitalBDB: ReturnType<typeof DatabaseConfig>;
}

const appConfig = (): Config => ({
    hospitalADB,
    hospitalBDB
});

export default appConfig