import { Request, Response } from "express";
import pool from "../utils/db";
import { CreateMealRequest, MealFoodItem, Food, MealTotals } from "../types";

export const createMeal = async (req: Request, res: Response) => {
  // START A DATABASE CLIENT FOR TRANSACTION
  const client = await pool.connect();

  try {
    // STEP 1: Extract data from request
    const {
      name,
      meal_type,
      meal_date,
      is_template,
      foods,
    }: CreateMealRequest = req.body;
    const userId = req.user?.id; // Set by auth middleware

    // STEP 2: Validate request data
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Meal name is required" });
    }

    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({
        error: "At least one food item is required",
      });
    }

    // Validate each food item has required fields
    for (const food of foods) {
      if (!food.food_id) {
        return res.status(400).json({
          error: "Each food must have a food_id",
        });
      }
      if (!food.servings && !food.quantity_g) {
        return res.status(400).json({
          error: "Each food must have either servings or quantity_g",
        });
      }
    }

    // STEP 3: Validate that all food IDs exist in database
    const foodIds = foods.map((f) => f.food_id);
    const foodCheckQuery = `
      SELECT id FROM foods WHERE id = ANY($1)
    `;
    const foodCheckResult = await client.query(foodCheckQuery, [foodIds]);

    const existingFoodIds = foodCheckResult.rows.map((row) => row.id);
    const invalidFoodIds = foodIds.filter(
      (id) => !existingFoodIds.includes(id)
    );

    if (invalidFoodIds.length > 0) {
      return res.status(404).json({
        error: `Invalid food IDs: ${invalidFoodIds.join(", ")}`,
      });
    }

    // STEP 4: BEGIN TRANSACTION
    // This ensures all-or-nothing: either everything succeeds or nothing is saved
    await client.query("BEGIN");

    // STEP 5: Insert meal record
    const insertMealQuery = `
      INSERT INTO meals (user_id, name, meal_type, meal_date, is_template)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, name, meal_type, meal_date, is_template, created_at, updated_at
    `;

    const mealResult = await client.query(insertMealQuery, [
      userId,
      name,
      meal_type || null,
      meal_date || null,
      is_template || false,
    ]);

    const meal = mealResult.rows[0];
    const mealId = meal.id;

    // STEP 6: Insert all meal_foods records
    const insertedFoods: any[] = [];

    for (const food of foods) {
      const insertFoodQuery = `
        INSERT INTO meal_foods (meal_id, food_id, servings, quantity_g)
        VALUES ($1, $2, $3, $4)
        RETURNING id, meal_id, food_id, servings, quantity_g, created_at
      `;

      const foodResult = await client.query(insertFoodQuery, [
        mealId,
        food.food_id,
        food.servings || null,
        food.quantity_g || null,
      ]);

      insertedFoods.push(foodResult.rows[0]);
    }

    // STEP 7: COMMIT TRANSACTION
    // All queries succeeded, so save everything to the database
    await client.query("COMMIT");

    // STEP 8: Calculate total macros
    // Query the foods to get their nutrition info
    const nutritionQuery = `
      SELECT 
        f.id,
        f.name,
        f.category,
        f.protein_per_100g,
        f.fat_per_100g,
        f.carbs_per_100g,
        f.calories_per_100g,
        mf.servings,
        mf.quantity_g
      FROM meal_foods mf
      JOIN foods f ON mf.food_id = f.id
      WHERE mf.meal_id = $1
    `;

    const nutritionResult = await client.query(nutritionQuery, [mealId]);
    const foodsWithNutrition = nutritionResult.rows;

    // Calculate totals
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalCalories = 0;

    foodsWithNutrition.forEach((food: any) => {
      // Use quantity_g if provided, otherwise assume 100g per serving
      const grams = food.quantity_g || food.servings * 100;
      const multiplier = grams / 100;

      totalProtein += food.protein_per_100g * multiplier;
      totalFat += food.fat_per_100g * multiplier;
      totalCarbs += food.carbs_per_100g * multiplier;
      totalCalories += food.calories_per_100g * multiplier;
    });

    // STEP 9: Return created meal with full details
    res.status(201).json({
      message: "Meal created successfully",
      meal: {
        ...meal,
        foods: foodsWithNutrition.map((f: any) => ({
          id: f.id,
          name: f.name,
          category: f.category,
          servings: f.servings,
          quantity_g: f.quantity_g,
          protein_per_100g: f.protein_per_100g,
          fat_per_100g: f.fat_per_100g,
          carbs_per_100g: f.carbs_per_100g,
          calories_per_100g: f.calories_per_100g,
        })),
      },
      totals: {
        total_protein: Math.round(totalProtein * 100) / 100,
        total_fat: Math.round(totalFat * 100) / 100,
        total_carbs: Math.round(totalCarbs * 100) / 100,
        total_calories: Math.round(totalCalories * 100) / 100,
      },
    });
  } catch (error) {
    // ROLLBACK TRANSACTION on error
    // This undoes all database changes if anything failed
    await client.query("ROLLBACK");

    console.error("Create meal error:", error);
    res.status(500).json({ error: "Failed to create meal" });
  } finally {
    // Always release the client back to the pool
    client.release();
  }
};
