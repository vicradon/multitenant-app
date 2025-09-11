"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const db_config_1 = require("./db.config");
dotenv.config();
const appConfig = () => ({
    hospitalADB: db_config_1.hospitalADB,
    hospitalBDB: db_config_1.hospitalBDB
});
exports.default = appConfig;
//# sourceMappingURL=index.js.map