import { Router } from "express";
import { addSupplier, loginSuplier } from "../controller/supplier";

const router = Router();

router.post("/addsupplier", addSupplier);
router.post("/login", loginSuplier);
export default router;
