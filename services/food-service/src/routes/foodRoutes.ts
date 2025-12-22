import { Router } from 'express';
import { getFoods } from '../controllers/foodControllers';

const router = Router();

router.get('/', getFoods);

export default router;