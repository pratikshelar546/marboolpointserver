import { Router } from "express";
import { addSupplier } from "../controller/supplier";

const rounter = Router();

rounter.post("/addsupplier", addSupplier);
export default rounter;
