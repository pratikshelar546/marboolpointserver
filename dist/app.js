"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importDefault(require("express"));
const Supplier_1 = __importDefault(require("./routes/Supplier"));
const Products_1 = __importDefault(require("./routes/Products"));
const Seller_1 = __importDefault(require("./routes/Seller"));
const Admin_1 = __importDefault(require("./routes/Admin"));
const order_1 = __importDefault(require("./routes/order"));
const dotenv = __importStar(require("dotenv"));
const cloudinary_1 = require("cloudinary");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = __importDefault(require("./config/auth"));
const cors_1 = __importDefault(require("cors"));
const connecttion_1 = __importDefault(require("./utils/connecttion"));
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, auth_1.default)(passport_1.default);
// googleConfig(passport);
app.use(express_1.default.json());
app.use((0, express_session_1.default)({ secret: "MARBOL_ADMIN" }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assuming connection is a database connection function
        yield connecttion_1.default;
        console.log("Connected to the database successfully");
    }
    catch (error) {
        console.error("Error connecting to the database", error);
    }
});
// CREATE TABLE admin(email VARCHAR(70) UNIQUE NOT NULL,name VARCHAR(100) NOT NULL, password VARCHAR(100) NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
// INSERT INTO admin(email, name, password) VALUES('pratik@fhfh.cncn','pratik','121212')
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.use("/api/v1/supplier", Supplier_1.default);
app.use("/api/v1/admin", Admin_1.default);
app.use("/api/v1/products", Products_1.default);
app.use("/api/v1/seller", Seller_1.default);
app.use("/api/v1/order", order_1.default);
app.listen(8080, () => {
    connectDb();
    console.log("Server is running on port 8080");
});
