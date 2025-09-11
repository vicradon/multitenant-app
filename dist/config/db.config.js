"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hospitalBDB = exports.hospitalADB = exports.DatabaseConfig = void 0;
const DatabaseConfig = (url, migrationsPath) => ({
    type: 'postgres',
    url,
    migrations: [migrationsPath],
    logging: false,
    synchronize: true,
    cache: { duration: 1000 },
});
exports.DatabaseConfig = DatabaseConfig;
exports.hospitalADB = (0, exports.DatabaseConfig)("postgresql://hospital_a:hospital_a@localhost:5432/hospital_a", 'dist/src/db/migrations/hospitalA/*.js');
exports.hospitalBDB = (0, exports.DatabaseConfig)(process.env.HOSPITAL_B_DB_URL, 'dist/src/db/migrations/hospitalB/*.js');
//# sourceMappingURL=db.config.js.map