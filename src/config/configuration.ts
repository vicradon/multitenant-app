import { DatabaseConfig } from "./db.config";

const port = process.env.PORT || "4001"

const hospital_a_db_url = process.env.HOSPITAL_A_DB_URL
const hospital_b_db_url = process.env.HOSPITAL_B_DB_URL

console.log(hospital_a_db_url)

interface DBConfig {
    hospitalA?: ReturnType<typeof DatabaseConfig>;
    hospitalB?: ReturnType<typeof DatabaseConfig>;
}

export const dbConfigs: DBConfig = {}

if (hospital_a_db_url) {
    dbConfigs["hospitalA"] = DatabaseConfig(hospital_a_db_url, "dist/src/db/migrations/hospitalA/*.js")
}
if (hospital_b_db_url) {
    dbConfigs["hospitalB"] = DatabaseConfig(hospital_b_db_url, "dist/src/db/migrations/hospitalA/*.js")
}

export default () => ({
    port: parseInt(port, 10),
    ...dbConfigs
});