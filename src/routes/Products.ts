import { Router } from "express";
import { addProduct, getAllProduct } from "../controller/products";

const router = Router();

router.post("/addProduct", addProduct);
router.get("/getAllProduct", getAllProduct);

export default router;
