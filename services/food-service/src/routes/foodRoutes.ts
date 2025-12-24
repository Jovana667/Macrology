import { Router } from "express";
import { getFoods, getFoodById } from "../controllers/foodControllers";

const router = Router();

// Get all foods (with pagination and filters)
router.get("/", getFoods);

// Get single food by ID
// IMPORTANT: This must come AFTER any specific routes like /popular
// because Express matches routes in order and would treat "popular" as an ID
router.get("/:id", getFoodById);

export default router;
