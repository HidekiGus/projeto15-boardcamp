import { Router } from "express";
import { postCustomers, getCustomers, putCustomers } from "../controllers/customersController.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomers);
router.post("/customers", postCustomers);
router.put("/customers/:id", putCustomers);

export default router;