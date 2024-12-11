"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSupplier = void 0;
const db_1 = require("../../config/db");
const findSupplierviaEmail = "SELECT * FROM supplier WHERE email = $1";
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, address } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Invalid data" });
        }
        const exituser = yield db_1.client.query(findSupplierviaEmail, [email]);
        if (exituser.rows.length > 0) {
            return res
                .status(400)
                .json({ message: "Supplier already exists with this email id" });
        }
        console.log([name, email, password, address]);
        const addSupplier = yield db_1.client.query("INSERT INTO supplier (name, email, password,admin_id) VALUES ($1, $2, $3, $4) RETURNING name, email, supplier_id", [name, email, password, 1]);
        console.log(addSupplier);
        res.status(200).json({ data: addSupplier.rows[0] });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error,
        });
    }
});
exports.addSupplier = addSupplier;
