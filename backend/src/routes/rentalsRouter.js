import { getRentals, postRentals } from "../controllers/rentalsController.js";
import { Router } from "express";

const router = Router();

router.post("/rentals", postRentals);
router.get("/rentals", getRentals);

export default router;