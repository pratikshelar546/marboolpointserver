import { Router } from "express";
import { createSeller } from "../controller/Seller";

const router = Router();

router.post("/createSeller", createSeller);

export default router;
