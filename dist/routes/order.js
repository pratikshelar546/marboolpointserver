"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const order_1 = require("../controller/order");
const router = (0, express_1.Router)();
router.post("/placeOrder", passport_1.default.authenticate("jwt", { session: false }), order_1.placeOrder);
router.put("/update/:order_id", passport_1.default.authenticate("jwt", { session: false }), order_1.updateOrder);
router.get("/bySeller", passport_1.default.authenticate("jwt", { session: false }), order_1.getAllOrderBySeller);
router.get("/byProduct/:id", passport_1.default.authenticate("jwt", { session: false }), order_1.getProductOrder);
router.get("/:id", passport_1.default.authenticate("jwt", { session: false }), order_1.getOrderById);
router.delete("/delete/:id", passport_1.default.authenticate("jwt", { session: false }), order_1.deleteOrder);
router.get("/", passport_1.default.authenticate("jwt", { session: false }), order_1.getAllOrders);
exports.default = router;
