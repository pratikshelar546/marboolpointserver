import { Router } from "express";
import passport from "passport";
import {
  deleteOrder,
  getAllOrderBySeller,
  getAllOrders,
  getOrderById,
  getProductOrder,
  placeOrder,
  updateOrder,
} from "../controller/order";

const router = Router();

router.post(
  "/placeOrder",
  passport.authenticate("jwt", { session: false }),
  placeOrder
);

router.put(
  "/update/:order_id",
  passport.authenticate("jwt", { session: false }),
  updateOrder
);

router.get(
  "/bySeller",
  passport.authenticate("jwt", { session: false }),
  getAllOrderBySeller
);

router.get(
  "/byProduct/:id",
  passport.authenticate("jwt", { session: false }),
  getProductOrder
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  getOrderById
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  deleteOrder
);
router.get("/", passport.authenticate("jwt", { session: false }), getAllOrders);
export default router;
