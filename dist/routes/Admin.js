"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controller/admin");
const router = (0, express_1.Router)();
router.post("/signin", admin_1.signupAdmin);
router.post("/createAdmin", admin_1.createAdmin);
exports.default = router;
