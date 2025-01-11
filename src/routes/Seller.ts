import { Router } from "express";
import {
  createSeller,
  deleteSeller,
  getAllSeller,
  getSellerById,
  loginSeller,
  updatePassword,
  updateSelller,
} from "../controller/Seller";
import passport from "passport";

const router = Router();

router.post("/createSeller", createSeller);
router.get("/getAllSellers", getAllSeller);
router.post("/login", loginSeller);
router.put(
  "/update",
  passport.authenticate("jwt", { session: false }),
  updateSelller
);

router.delete(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  deleteSeller
);

router.get("/getSellerById/:id", getSellerById)

router.post("/update-password/:id", passport.authenticate("jwt", { session: false }), updatePassword)

export default router;
