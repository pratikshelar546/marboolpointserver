import { Router } from "express";
import {
  addSupplier,
  deleteSupplier,
  getSupplier,
  getSupplierById,
  loginSuplier,
  updateSupplier,
} from "../controller/supplier";
import passport from "passport";

const router = Router();

router.post(
  "/addsupplier",
  passport.authenticate("jwt", { session: false }),
  addSupplier
);
router.post("/login", loginSuplier);
router.get("/getAllSupplier", getSupplier);
router.get("/getSupplier/:id", getSupplierById);
router.put("/updateSupplier/:id", updateSupplier);
router.delete("/deleteSupplier/:id", deleteSupplier);
export default router;
