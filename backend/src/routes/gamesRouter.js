import { postGames } from "../controllers/gamesController.js";
import { Router } from "express";

const router = Router();

router.post("/games", postGames);

export default router;