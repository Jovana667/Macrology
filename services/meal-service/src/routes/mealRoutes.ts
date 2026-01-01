import { Router } from "express";
import { createMeal } from "../controllers/mealController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Create a new meal (protected route - requires authentication)
router.post("/", verifyToken, createMeal);

export default router;
