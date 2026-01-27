import { Router } from "express";
import { createMeal, getMeals, getMealById, getMealPlanById } from "../controllers/mealController";
import { verifyToken } from "../middleware/auth";

const router = Router();

// Get all meals for authenticated user (with pagination)
router.get("/", verifyToken, getMeals);

// Get a specific meal by ID (protected route - requires authentication)
router.get("/:id", verifyToken, getMealById);

router.get("/plans/:id", verifyToken, getMealPlanById);

// Create a new meal (protected route - requires authentication)
router.post("/", verifyToken, createMeal);

export default router;
