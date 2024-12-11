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
exports.signupAdmin = void 0;
const auth_1 = require("../../utils/auth");
const db_1 = require("../../config/db");
const findadminwitheemail = "SELECT * FROM admin WHERE email =$1";
const signupAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "inavild data" });
        const existAdmin = yield db_1.client.query(findadminwitheemail, email);
        if (existAdmin.rows.length === 0)
            return res
                .status(404)
                .json({ message: "Admin with this creadential not found" });
        const admin = existAdmin.rows[0];
        const passwordMatch = yield (0, auth_1.comaprePassword)(password, admin.password);
        if (!passwordMatch)
            return res.status(401).json({ message: "Inavalid credenstials" });
        const token = (0, auth_1.genrateJwtToken)(admin.id);
        res.status(200).json({
            message: "sign up successfully",
            admin: {
                name: admin.name,
                email: admin.email,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "something went wrong",
            error: error,
        });
    }
});
exports.signupAdmin = signupAdmin;
