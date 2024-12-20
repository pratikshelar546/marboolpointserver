import { Router } from "express";
import { createSeller, getAllSeller, loginSeller } from "../controller/Seller";

const router = Router();

router.post("/createSeller", createSeller);
router.get("/getAllSellers", getAllSeller);
router.post("/login", loginSeller);

export default router;
