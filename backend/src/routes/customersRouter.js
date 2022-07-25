import { Router } from "express";
import { postCustomers } from "../controllers/customersController.js";

const router = Router();

// router.get("/customers", getCustomers);
router.post("/customers", postCustomers);

export default router;