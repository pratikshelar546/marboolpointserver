import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controller/products";
import upload from "../middleware/multer";

const router = Router();

router.post("/addProduct", upload.single("image"), addProduct);
router.get("/getAllProduct", getAllProduct);
router.get("/getProduct/:id", getProductById);
router.put("/updateProduct/:id", upload.single("image"),updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;
