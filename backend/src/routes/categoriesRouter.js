import { Router } from "express";
import { getCategories, postCategories } from "../controllers/categoriesController";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", postCategories);

export default router;