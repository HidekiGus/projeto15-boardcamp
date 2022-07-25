import { getRentals, postParamsRentals, postRentals } from "../controllers/rentalsController.js";
import { Router } from "express";

const router = Router();

router.post("/rentals", postRentals);
router.post("/rentals/:id/return", postParamsRentals);

export default router;