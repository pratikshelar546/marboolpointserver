"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_1 = require("../controller/products");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = (0, express_1.Router)();
router.post("/addProduct", multer_1.default.single("image"), products_1.addProduct);
router.get("/getAllProduct", products_1.getAllProduct);
router.get("/getProduct/:id", products_1.getProductById);
router.put("/updateProduct/:id", multer_1.default.single("image"), products_1.updateProduct);
router.delete("/deleteProduct/:id", products_1.deleteProduct);
exports.default = router;
