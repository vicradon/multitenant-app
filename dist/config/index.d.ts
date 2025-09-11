import { DatabaseConfig } from './db.config';
interface Config {
    hospitalADB: ReturnType<typeof DatabaseConfig>;
    hospitalBDB: ReturnType<typeof DatabaseConfig>;
}
declare const appConfig: () => Config;
export default appConfig;
