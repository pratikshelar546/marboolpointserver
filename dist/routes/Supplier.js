"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_1 = require("../controller/supplier");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post("/addsupplier", passport_1.default.authenticate("jwt", { session: false }), supplier_1.addSupplier);
router.post("/login", supplier_1.loginSuplier);
router.get("/getAllSupplier", supplier_1.getSupplier);
router.get("/getSupplier/:id", supplier_1.getSupplierById);
router.put("/updateSupplier/:id", supplier_1.updateSupplier);
router.delete("/deleteSupplier/:id", supplier_1.deleteSupplier);
exports.default = router;
