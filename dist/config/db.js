"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const pg_1 = require("pg");
exports.client = new pg_1.Client({
    user: 'postgres',
    host: 'marboolpoint.cxkqeay6cxaq.us-east-1.rds.amazonaws.com',
    database: 'marboolpoint',
    password: 'Marboolpoint#12',
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Disable SSL certificate validation (for testing purposes)
    },
});
