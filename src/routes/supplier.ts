import { Router } from "express";
import {
  addSupplier,
  getSupplier,
  getSupplierById,
  loginSuplier,
  updateSupplier,
} from "../controller/supplier";

const router = Router();

router.post("/addsupplier", addSupplier);
router.post("/login", loginSuplier);
router.get("/getAllSupplier", getSupplier);
router.get("/getSupplier/:id", getSupplierById);
router.put("/updateSupplier/:id", updateSupplier)
export default router;
