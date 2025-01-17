"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Seller_1 = require("../controller/Seller");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post("/createSeller", Seller_1.createSeller);
router.get("/getAllSellers", Seller_1.getAllSeller);
router.post("/login", Seller_1.loginSeller);
router.put("/update", passport_1.default.authenticate("jwt", { session: false }), Seller_1.updateSelller);
router.delete("/delete/:id", passport_1.default.authenticate("jwt", { session: false }), Seller_1.deleteSeller);
router.get("/getSellerById/:id", Seller_1.getSellerById);
router.put("/update-password/:id", passport_1.default.authenticate("jwt", { session: false }), Seller_1.updatePassword);
exports.default = router;
