"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const supplier_1 = __importDefault(require("./routes/supplier"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
db_1.client
    .connect()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log("somthing went wrong", err));
// {
//     host:"localhost",
//     user: "postgres",
//     port:5432,
//     password:"pratik",
//     database:"postgres"
// }
// CREATE TABLE admin(email VARCHAR(70) UNIQUE NOT NULL,name VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
// INSERT INTO admin(email, name, password) VALUES('pratik@fhfh.cncn','pratik','121212')
// app.use("/api/v1/admin");
app.use("/api/v1/supplier", supplier_1.default);
app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
