import { Router } from "express";
import { createAdmin, signupAdmin, updatePassword } from "../controller/admin";
import passport from "passport";

const router = Router();

router.post("/signin", signupAdmin);
router.post("/createAdmin", createAdmin);
router.post("/update-password", passport.authenticate("jwt", { session: false }), updatePassword)

export default router;
