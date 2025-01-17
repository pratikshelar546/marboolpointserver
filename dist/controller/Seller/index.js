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
exports.updatePassword = exports.getSellerById = exports.deleteSeller = exports.updateSelller = exports.loginSeller = exports.getAllSeller = exports.createSeller = void 0;
const db_1 = require("../../config/db");
const auth_1 = require("../../utils/auth");
const createSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, phoneNumber, address, password } = req.body;
        const sellerExist = yield db_1.client.query("SELECT * FROM seller WHERE email=$1", [email]);
        if (((_a = sellerExist === null || sellerExist === void 0 ? void 0 : sellerExist.rows[0]) === null || _a === void 0 ? void 0 : _a.isdeleted) === true) {
            const newPassword = yield (0, auth_1.hashPasssword)(password);
            yield db_1.client.query("UPDATE seller SET name= $1,email=$2,phoneNumber=$3,address=$4,password=$5 WHERE seller_id = $6", [
                name,
                email,
                phoneNumber,
                address,
                newPassword,
                sellerExist.rows[0].seller_id,
            ]);
            return res.status(200).json({ success: true, message: "User updated" });
        }
        // if (sellerExist.rows.length !== 0)
        //   return res
        //     .status(400)
        //     .json({ success: false, message: "Seller already exist" });
        const newPassword = yield (0, auth_1.hashPasssword)(password);
        const seller = yield db_1.client.query("INSERT INTO seller (name,email,phoneNumber,address,password) VALUES ($1,$2,$3,$4,$5) RETURNING seller_id", [name, email, phoneNumber, address, newPassword]);
        const token = yield (0, auth_1.genrateJwtToken)(seller.rows[0].seller_id, "seller");
        return res
            .status(200)
            .json({ success: true, message: "Seller created", token });
    }
    catch (error) {
        console.log("*************add seller*****************");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong",
        });
    }
});
exports.createSeller = createSeller;
const loginSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ success: false, message: "creadentials required" });
        const sellerExist = yield db_1.client.query("SELECT * FROM seller WHERE email =$1", [email]);
        const seller = sellerExist.rows[0];
        if (!seller || seller.isdeleted === true)
            return res
                .status(404)
                .json({ success: false, message: "Seller dose not exist" });
        const compare = yield (0, auth_1.comaprePassword)(password, seller.password);
        if (!compare)
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        const token = yield (0, auth_1.genrateJwtToken)(seller.seller_id, "seller");
        return res
            .status(200)
            .json({ success: true, message: "Login succesfully", token });
    }
    catch (error) {
        console.log("*************add seller*****************");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong",
        });
    }
});
exports.loginSeller = loginSeller;
const getAllSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellers = yield db_1.client.query("SELECT * FROM seller WHERE isdeleted = false");
        if (sellers.rows.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "Seller not found" });
        return res.status(200).json({
            success: true,
            message: "Fetched all sellers",
            count: sellers.rowCount,
            data: sellers.rows,
        });
    }
    catch (error) {
        console.log("*************get all seller*****************");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong",
        });
    }
});
exports.getAllSeller = getAllSeller;
const updateSelller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user: string = req?.user;
        const { seller_id } = req.user;
        const sellerExist = yield db_1.client.query("SELECT * FROM seller WHERE seller_id=$1", [seller_id]);
        const seller = sellerExist.rows[0];
        if (!seller || seller.isdeleted === true)
            return res
                .status(404)
                .json({ success: false, message: "USer not found" });
        let query = "UPDATE SELLER SET";
        const values = [];
        let index = 1;
        for (const [key, value] of Object.entries(req.body)) {
            query += ` ${key} =$${index}, `;
            values.push(value);
            index++;
        }
        query = query.slice(0, -2);
        query += ` WHERE seller_id = $${values.length + 1} RETURNING seller_id, `;
        values.push(seller_id);
        for (const [key] of Object.entries(req.body)) {
            query += ` ${key},`;
        }
        query = query.slice(0, -1);
        const updateSeller = yield db_1.client.query(query, values);
        return res.status(200).json({
            success: true,
            message: "user details updated",
            data: updateSeller.rows[0],
        });
    }
    catch (error) {
        console.log("*************update seller*****************");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong",
        });
    }
});
exports.updateSelller = updateSelller;
const deleteSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { seller_id } = req.params;
        const seller = yield db_1.client.query("SELECT isdeleted FROM seller WHERE seller_id = $1", [seller_id]);
        if (seller.rows[0].length === 0 || seller.rows[0].isdeleted == true)
            return res
                .status(404)
                .json({ message: "User not found", success: false });
        yield db_1.client.query("UPDATE seller SET isdeleted = true WHERE seller_id =$1", [seller_id]);
        return res
            .status(200)
            .json({ success: true, message: "USer deleted successfully" });
    }
    catch (error) {
        console.log("*************get seller*****************");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong",
        });
    }
});
exports.deleteSeller = deleteSeller;
const getSellerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const seller = yield db_1.client.query("SELECT * FROM seller WHERE seller_id= $1", [id]);
        if (seller.rows.length === 0 || seller.rows[0].isdeleted === true) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res
            .status(200)
            .json({ success: true, message: "Product fetched", data: seller.rows[0] });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
});
exports.getSellerById = getSellerById;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const hashPass = yield (0, auth_1.hashPasssword)(password);
        const updatePass = yield db_1.client.query("UPDATE seller set password =$1 WHERE seller_id =$2 RETURNING name", [hashPass, id]);
        if (updatePass.rowCount !== 0)
            return res.status(200).json({ message: "Password chnaged", success: true });
        return res.status(404).json({ message: "Check creadential", success: false });
    }
    catch (error) {
        console.log("*************update admin pass*****************");
        return res.status(500).json({
            success: false,
            message: "Somthing went wrong",
        });
    }
});
exports.updatePassword = updatePassword;
