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
const db_1 = require("../../config/db");
const findSupplierviaEmail = "SELECT * FROM supplier WHERE email = $1";
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, address } = req.body;
        if (!name || !email || !password)
            return res.status(404).json({ message: "Inavlid data" });
        const exituser = yield db_1.client.query(findSupplierviaEmail, email);
        if (exituser)
            res
                .status(400)
                .json({ message: "Supplier already exist with this email id" });
        const addSupplier = yield db_1.client.query("INSERT INTO supplier (name,email,password,address) VALUES ($1,$2,$3,$4) RETURNING name,email,supplier_id", [name, email, password, address]);
        res.status(200).json(addSupplier.rows[0]);
    }
    catch (error) {
        res.status(500).json({
            message: "something went wrong",
            error: error,
        });
    }
});
