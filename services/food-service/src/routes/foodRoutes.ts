import { Router } from "express";
import {
  getFoods,
  getFoodById,
  searchFoods,
} from "../controllers/foodControllers";

const router = Router();

// Get all foods (with pagination and filters)
router.get("/", getFoods);

// Autocomplete search - MUST come before /:id route
// This handles /api/foods/search?q=chicken
router.get("/search", searchFoods);

// Get single food by ID
// IMPORTANT: This must come AFTER any specific routes like /search
// because Express matches routes in order and would treat "search" as an ID
router.get("/:id", getFoodById);

export default router;
