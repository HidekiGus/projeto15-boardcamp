import { postRentals } from "../controllers/rentalsController.js";
import { Router } from "express";

const router = Router();

router.post("/rentals", postRentals);

export default router;