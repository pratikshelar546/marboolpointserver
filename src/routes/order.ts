import { Router } from "express";
import passport from "passport";
import { placeOrder, updateOrder } from "../controller/order";

const router = Router();

router.post(
  "/placeOrder",
  passport.authenticate("jwt", { session: false }),
  placeOrder
);

router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  updateOrder
);
export default router;
