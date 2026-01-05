import { Request, Response } from 'express';
import pool from "../utils/db";
import {
    CreatenutritionGoalRequest
} from "../types";

export const createNutritionGoal = async (req: Request, res: Response) => {
    try {
        // STEP 1: Get userId from JWT
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        // STEP 2: Extract data from request body (NO userId here!)
        const { target_calories, target_protein_g, target_fat_g, target_carbs_g, dietary_restrictions } = req.body;
        
        // STEP 3: Validate (INSIDE the function!)
        if (target_calories !== undefined && target_calories <= 0) {
            return res.status(400).json({ error: "target_calories must be positive" });
        }
        if (target_protein_g !== undefined && target_protein_g <= 0) {
            return res.status(400).json({ error: "target_protein_g must be positive" });
        }
        if (target_fat_g !== undefined && target_fat_g <= 0) {
            return res.status(400).json({ error: "target_fat_g must be positive" });
        }
        if (target_carbs_g !== undefined && target_carbs_g <= 0) {
            return res.status(400).json({ error: "target_carbs_g must be positive" });
        }

        // STEP 4: Database UPSERT
        const result = await pool.query(
            `INSERT INTO user_profiles (user_id, target_calories, target_protein_g, target_fat_g, target_carbs_g, dietary_restrictions)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (user_id) DO UPDATE SET
               target_calories = EXCLUDED.target_calories,
               target_protein_g = EXCLUDED.target_protein_g,
               target_fat_g = EXCLUDED.target_fat_g,
               target_carbs_g = EXCLUDED.target_carbs_g,
               dietary_restrictions = EXCLUDED.dietary_restrictions
             RETURNING *`,
            [userId, target_calories, target_protein_g, target_fat_g, target_carbs_g, dietary_restrictions]
        );
        
        // STEP 5: Return success
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

export const getNutritionGoalByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
}
        const query = `
            SELECT id, target_calories, target_protein_g, target_fat_g, target_carbs_g, dietary_restrictions
            FROM user_profiles
            WHERE user_id = $1
        `;
        const result = await pool.query(query, [userId]);
        if (result.rows.length === 0) {
            return res.status(200).json(
                { target_calories: null, target_protein_g: null, target_fat_g: null, target_carbs_g: null, dietary_restrictions: null }
            );
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Get nutrition goal error:", error);
        res.status(500).json({ error: "Failed to retrieve nutrition goal" });
    }
};