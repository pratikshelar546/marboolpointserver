"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const postgresClient = () => {
    return db_1.client.connect().then(() => console.log("Connected to database")).catch((err) => console.log("somthing went wrong", err));
};
const connection = (_a = globalThis.connection) !== null && _a !== void 0 ? _a : postgresClient();
exports.default = connection;
if (process.env.NODE_ENV !== 'production')
    globalThis.connection = connection;
