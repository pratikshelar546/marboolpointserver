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
exports.genrateJwtToken = exports.comaprePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_key = "MARBOL_ADMIN";
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
const genrateJwtToken = (credenstials) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = jsonwebtoken_1.default.sign({ admin: credenstials }, secret_key, {
            expiresIn: "15d",
        });
        return token;
    }
    catch (error) {
        console.log("jwt error", error);
        throw new Error("JWT token genration falied");
    }
});
exports.genrateJwtToken = genrateJwtToken;
