import { Router } from 'express';
import {
    createNutritionGoal,
} from '../controllers/userControllers';
import { verifyToken } from '../middleware/auth';

const router = Router();
// Create a new goal for authenticated user
router.put('/profile', verifyToken, createNutritionGoal);

export default router;
