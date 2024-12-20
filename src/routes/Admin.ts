import { Router } from "express";
import { createAdmin, signupAdmin } from "../controller/admin";

const router = Router();

router.post("/signin", signupAdmin);
router.post("/createAdmin", createAdmin);

export default router;
