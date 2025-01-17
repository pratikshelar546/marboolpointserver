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
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const db_1 = require("./db");
const JWTStrategy = passport_jwt_1.default.Strategy;
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "MARBOL_ADMIN",
};
const findAdmin = "SELECT admin_id, name FROM admin WHERE admin_id = $1";
const findSeller = "SELECT seller_id, name FROM seller WHERE seller_id = $1";
exports.default = (passport) => {
    console.log(passport);
    passport.use(new JWTStrategy(options, (jwt__payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(jwt__payload);
        try {
            let findQuery = "";
            if (jwt__payload.role === "admin") {
                findQuery = findAdmin;
            }
            else if (jwt__payload.role === "seller") {
                findQuery = findSeller;
            }
            else {
                return done(null, false);
            }
            const find = yield db_1.client.query(findQuery, [jwt__payload.user]);
            const doesUserExist = Object.assign({ role: jwt__payload.role }, find.rows[0]);
            if (!doesUserExist) {
                return done(null, false);
            }
            // Type-safe access based on role
            if ((jwt__payload.role === "admin" && "admin_id" in doesUserExist) ||
                (jwt__payload.role === "seller" && "seller_id" in doesUserExist)) {
                return done(null, doesUserExist);
            }
            return done(null, false);
        }
        catch (error) {
            return done(error, false);
        }
    })));
};
