import { Router } from "express";
import { createMeal, getMeals } from "../controllers/mealController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all meals for authenticated user (with pagination)
router.get("/", verifyToken, getMeals);

// Create a new meal (protected route - requires authentication)
router.post("/", verifyToken, createMeal);

export default router;
