"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplier_1 = require("../controller/supplier");
const rounter = (0, express_1.Router)();
rounter.post("/addsupplier", supplier_1.addSupplier);
exports.default = rounter;
