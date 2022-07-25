import { deleteRentals, getRentals, postParamsRentals, postRentals } from "../controllers/rentalsController.js";
import { Router } from "express";

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", postRentals);
router.post("/rentals/:id/return", postParamsRentals);
router.delete("/rentals/:id", deleteRentals);

export default router;