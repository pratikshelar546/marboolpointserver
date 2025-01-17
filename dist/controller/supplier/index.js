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
exports.deleteSupplier = exports.updateSupplier = exports.getSupplierById = exports.getSupplier = exports.loginSuplier = exports.addSupplier = void 0;
const db_1 = require("../../config/db");
const findSupplierviaEmail = "SELECT * FROM supplier WHERE phoneNumber = $1";
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phoneNumber, address } = req.body;
        if (!name || !phoneNumber || !address) {
            return res.status(400).json({ success: false, message: "Invalid data" });
        }
        const exituser = yield db_1.client.query(findSupplierviaEmail, [phoneNumber]);
        if (exituser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Supplier already exists with this phone number",
            });
        }
        const addSupplier = yield db_1.client.query("INSERT INTO supplier (name,phoneNumber,address,admin_id) VALUES ($1, $2, $3, $4)", [name, phoneNumber, address, 1]);
        res
            .status(200)
            .json({ success: true, message: "Supplier added successfully" });
    }
    catch (error) {
        console.log("Supplier");
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error });
    }
});
exports.addSupplier = addSupplier;
const loginSuplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber)
            return res.status(400).json({ success: false, message: "Invalid data" });
        const userExist = (yield db_1.client.query(findSupplierviaEmail, [phoneNumber])).rows[0];
        console.log(userExist);
        if (!userExist || userExist.isdeleted === true)
            return res
                .status(404)
                .json({ success: false, message: "Supplier dose not exist" });
        return res
            .status(200)
            .json({ success: true, message: "Login Successfully.." });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error });
    }
});
exports.loginSuplier = loginSuplier;
const getSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allSupplier = yield db_1.client.query("SELECT * FROM supplier WHERE isDeleted=false;");
        if (allSupplier.rows.length === 0) {
            return res
                .status(204)
                .json({ success: false, message: "There is no supplier exist" });
        }
        return res.status(200).json({
            success: true,
            message: "Fetched all supplier",
            data: allSupplier.rows,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
});
exports.getSupplier = getSupplier;
const getSupplierById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const supplier = yield db_1.client.query(`SELECT * FROM supplier WHERE supplier_id=$1`, [id]);
        if (supplier.rows.length === 0 || supplier.rows[0].isdeleted === true) {
            return res
                .status(404)
                .json({ success: false, message: "Supplier not found" });
        }
        return res.status(200).json({ success: true, data: supplier.rows[0] });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
});
exports.getSupplierById = getSupplierById;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const supplier = yield db_1.client.query(`SELECT * FROM supplier WHERE supplier_id=$1`, [id]);
        if (supplier.rows.length === 0 || supplier.rows[0].isdeleted === true) {
            return res
                .status(404)
                .json({ success: false, message: "Supplier not found" });
        }
        let qurey = "UPDATE supplier SET ";
        let values = [];
        let index = 1;
        for (const [key, value] of Object.entries(req.body)) {
            qurey += `${key}=$${index}, `;
            values.push(value);
            index++;
        }
        qurey = qurey.slice(0, -2);
        qurey += ` WHERE supplier_id = $${values.length + 1} RETURNING supplier_id,`;
        values.push(id);
        for (const [key] of Object.entries(req.body)) {
            qurey += ` ${key},`;
        }
        qurey = qurey.slice(0, -1);
        const updateSupplier = yield db_1.client.query(qurey, values);
        return res.status(200).json({
            success: true,
            message: "supplier udpated",
            data: updateSupplier,
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Something went wrong", error: error });
    }
});
exports.updateSupplier = updateSupplier;
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const supplier = yield db_1.client.query(`SELECT * FROM supplier WHERE supplier_id=$1`, [id]);
        if (supplier.rows.length === 0 || supplier.rows[0].isdeleted === true) {
            return res
                .status(404)
                .json({ success: false, message: "Supplier not found" });
        }
        yield db_1.client.query("UPDATE supplier SET isDeleted=true WHERE supplier_id=$1", [id]);
        return res.status(200).json({ message: "Supplier deleted", success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
});
exports.deleteSupplier = deleteSupplier;
