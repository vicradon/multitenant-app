"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfigs = void 0;
const db_config_1 = require("./db.config");
const port = process.env.PORT || "4001";
const hospital_a_db_url = process.env.HOSPITAL_A_DB_URL;
const hospital_b_db_url = process.env.HOSPITAL_B_DB_URL;
console.log(hospital_a_db_url);
exports.dbConfigs = {};
if (hospital_a_db_url) {
    exports.dbConfigs["hospitalA"] = (0, db_config_1.DatabaseConfig)(hospital_a_db_url, "dist/src/db/migrations/hospitalA/*.js");
}
if (hospital_b_db_url) {
    exports.dbConfigs["hospitalB"] = (0, db_config_1.DatabaseConfig)(hospital_b_db_url, "dist/src/db/migrations/hospitalA/*.js");
}
exports.default = () => ({
    port: parseInt(port, 10),
    ...exports.dbConfigs
});
//# sourceMappingURL=configuration.js.map