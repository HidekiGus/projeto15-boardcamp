import { Router } from "express";
import { postCustomers, getCustomers } from "../controllers/customersController.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomers);
router.post("/customers", postCustomers);

export default router;