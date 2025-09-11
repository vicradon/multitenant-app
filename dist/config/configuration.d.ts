import { DatabaseConfig } from "./db.config";
interface DBConfig {
    hospitalA?: ReturnType<typeof DatabaseConfig>;
    hospitalB?: ReturnType<typeof DatabaseConfig>;
}
export declare const dbConfigs: DBConfig;
declare const _default: () => {
    hospitalA?: ReturnType<typeof DatabaseConfig>;
    hospitalB?: ReturnType<typeof DatabaseConfig>;
    port: number;
};
export default _default;
