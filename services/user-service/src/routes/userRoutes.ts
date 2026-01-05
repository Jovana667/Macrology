import { Router } from 'express';
import {
    createNutritionGoal, getNutritionGoalByUserId
} from '../controllers/userControllers';
import { verifyToken } from '../middleware/auth';

const router = Router();
// Create a new goal for authenticated user
router.put('/profile', verifyToken, createNutritionGoal);

// Get nutrition goal for authenticated user
router.get('/profile', verifyToken, getNutritionGoalByUserId);

export default router;
