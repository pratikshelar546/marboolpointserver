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
exports.createAdmin = exports.signupAdmin = void 0;
const auth_1 = require("../../utils/auth");
const db_1 = require("../../config/db");
const bcrypt_1 = require("bcrypt");
const findadminwitheemail = "SELECT * FROM admin WHERE email =$1";
const signupAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: "inavild data" });
        const existAdmin = yield db_1.client.query(findadminwitheemail, [email]);
        if (existAdmin.rows.length === 0)
            return res
                .status(404)
                .json({ success: false, message: "Admin with this creadential not found" });
        const admin = existAdmin.rows[0];
        const passwordMatch = yield (0, bcrypt_1.compare)(password, admin.password);
        if (!passwordMatch)
            return res.status(401).json({ success: false, message: "Inavalid credenstials" });
        const token = yield (0, auth_1.genrateJwtToken)(admin.admin_id, "admin");
        return res.status(200).json({
            success: true,
            message: "sign up successfully",
            token,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong",
            error: error,
        });
    }
});
exports.signupAdmin = signupAdmin;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: "Invalid data" });
        const hashPass = yield (0, auth_1.hashPasssword)(password);
        const admin = yield db_1.client.query("INSERT INTO admin (name,email,password) VALUES ($1,$2,$3) RETURNING admin_id", [name, email, hashPass]);
        const token = yield (0, auth_1.genrateJwtToken)(admin.rows[0].admin_id, "admin");
        return res.status(200).json({ success: true, message: "Admin created", token: token });
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
exports.createAdmin = createAdmin;
