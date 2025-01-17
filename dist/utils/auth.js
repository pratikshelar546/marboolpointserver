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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueCode = exports.genrateJwtToken = exports.comaprePassword = exports.hashPasssword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_key = "MARBOL_ADMIN";
const hashPasssword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = bcrypt_1.default.hash(password, 8);
    return hash;
});
exports.hashPasssword = hashPasssword;
const comaprePassword = (password, savedpassowrd) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bcrypt_1.default.compare(password, savedpassowrd);
    }
    catch (error) {
        console.log(error);
        throw new Error("Somthing went wrong! try again!");
    }
});
exports.comaprePassword = comaprePassword;
const genrateJwtToken = (credenstials, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = jsonwebtoken_1.default.sign({ user: credenstials, role: role }, secret_key, {
            expiresIn: "10d",
        });
        return token;
    }
    catch (error) {
        console.log("jwt error", error);
        throw new Error("JWT token genration falied");
    }
});
exports.genrateJwtToken = genrateJwtToken;
const generateUniqueCode = (name, supplierName) => {
    // Get first 2 letters of name (if available)
    const namePart = name.slice(0, 2).toUpperCase();
    // Get first 2 letters of supplier name (if available)
    const supplierPart = supplierName.slice(0, 2).toUpperCase();
    // Get the current year
    const year = new Date().getFullYear();
    // Generate 4 random digits
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Ensures 4 digits
    // Combine all parts
    return `MU${namePart}${supplierPart}${year}${randomDigits}`;
};
exports.generateUniqueCode = generateUniqueCode;
