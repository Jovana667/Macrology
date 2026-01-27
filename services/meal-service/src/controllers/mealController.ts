import { Request, Response } from "express";
import pool from "../utils/db";
import {
  CreateMealRequest,
  MealFoodItem,
  Food,
  MealTotals,
  MealDetail,
  FoodInMeal,
} from "../types";

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

    if (!foods || typeof foods !== "object") {
      return res.status(400).json({ error: "Foods object is required" });
    }
    // Check if at least one meal has foods
    const totalFoods =
      (foods.breakfast?.length || 0) +
      (foods.lunch?.length || 0) +
      (foods.dinner?.length || 0) +
      (foods.snack?.length || 0);

    if (totalFoods === 0) {
      return res
        .status(400)
        .json({ error: "At least one food item is required" });
    }

    // Validate each meal type's foods
    for (const mealType of ["breakfast", "lunch", "dinner", "snack"]) {
      const mealFoods = foods[mealType] || [];

      for (const food of mealFoods) {
        if (!food.food_id) {
          return res.status(400).json({
            error: `Each food in ${mealType} must have a food_id`,
          });
        }
        if (!food.quantity_g) {
          return res.status(400).json({
            error: `Each food in ${mealType} must have quantity_g`,
          });
        }
      }
    }

    // NEW - collect all food_ids from all meals
    const foodIds: number[] = [];
    for (const mealType of ["breakfast", "lunch", "dinner", "snack"]) {
      const mealFoods = foods[mealType] || [];
      for (const food of mealFoods) {
        foodIds.push(food.food_id);
      }
    }

    // Only check if there are foods to validate
    if (foodIds.length > 0) {
      const foodCheckQuery = `SELECT id FROM foods WHERE id = ANY($1)`;
      const foodCheckResult = await client.query(foodCheckQuery, [foodIds]);

      const existingFoodIds = foodCheckResult.rows.map((row) => row.id);
      const invalidFoodIds = foodIds.filter(
        (id) => !existingFoodIds.includes(id),
      );

      if (invalidFoodIds.length > 0) {
        return res.status(404).json({
          error: `Invalid food IDs: ${invalidFoodIds.join(", ")}`,
        });
      }
    }

    // STEP 4: BEGIN TRANSACTION
    // This ensures all-or-nothing: either everything succeeds or nothing is saved
    await client.query("BEGIN");

    // STEP 5: Insert meal record
    const insertMealQuery = `
      INSERT INTO meal_plans (user_id, name, is_template, meal_date)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, name, is_template, meal_date, created_at, updated_at
    `;

    const mealResult = await client.query(insertMealQuery, [
      userId,
      name,
      is_template || false,
      meal_date || new Date().toISOString().split("T")[0],
    ]);
    const mealPlan = mealResult.rows[0];
    const mealPlanId = mealPlan.id;

    // STEP 6: Insert the four meal records and their foods
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
    const insertedFoods: any[] = [];

    for (const mealType of mealTypes) {
      // Insert meal record
      const insertMealQuery = `
    INSERT INTO meals (meal_plan_id, user_id, meal_type, meal_date)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `;

      const mealResult = await client.query(insertMealQuery, [
        mealPlanId,
        userId,
        mealType,
        meal_date || new Date().toISOString().split("T")[0],
      ]);

      const mealId = mealResult.rows[0].id;

      // Insert foods for THIS meal
      const mealFoods = foods[mealType] || [];

      for (const food of mealFoods) {
        const insertFoodQuery = `
      INSERT INTO meal_foods (meal_id, food_id, quantity_g)
      VALUES ($1, $2, $3)
      RETURNING id, meal_id, food_id, quantity_g, created_at
    `;

        const foodResult = await client.query(insertFoodQuery, [
          mealId,
          food.food_id,
          food.quantity_g,
        ]);

        insertedFoods.push(foodResult.rows[0]);
      }
    }

    // STEP 7: COMMIT TRANSACTION
    await client.query("COMMIT");

    // STEP 8: Return success
    res.status(201).json({
      message: "Meal plan created successfully",
      meal_plan: {
        id: mealPlan.id,
        user_id: mealPlan.user_id,
        name: mealPlan.name,
        is_template: mealPlan.is_template,
        meal_date: mealPlan.meal_date,
        created_at: mealPlan.created_at,
        updated_at: mealPlan.updated_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Create meal error:", error);
    res.status(500).json({ error: "Failed to create meal" });
  } finally {
    client.release();
  }
};

export const getMeals = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const offset = (page - 1) * pageSize;

    // Query meal_plans instead of meals
    const mealsQuery = `
      SELECT 
        mp.id,
        mp.name,
        mp.is_template,
        mp.meal_date,
        mp.created_at,
        mp.updated_at,
        COUNT(DISTINCT m.id)::INTEGER as meal_count,
        COUNT(mf.id)::INTEGER as food_count
      FROM meal_plans mp
      LEFT JOIN meals m ON mp.id = m.meal_plan_id
      LEFT JOIN meal_foods mf ON m.id = mf.meal_id
      WHERE mp.user_id = $1
      GROUP BY mp.id
      ORDER BY mp.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const mealsResult = await pool.query(mealsQuery, [
      userId,
      pageSize,
      offset,
    ]);

    const countQuery = `
      SELECT COUNT(*)::INTEGER as total
      FROM meal_plans
      WHERE user_id = $1
    `;

    const countResult = await pool.query(countQuery, [userId]);
    const total = countResult.rows[0].total;

    res.status(200).json({
      meals: mealsResult.rows,
      total: total,
      page: page,
      pageSize: pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Get meals error:", error);
    res.status(500).json({ error: "Failed to retrieve meals" });
  }
};

export const getMealById = async (req: Request, res: Response) => {
  try {
    // STEP 1: Get authenticated user's ID and meal ID
    const userId = req.user?.id;
    const mealId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // STEP 2: Validate meal ID
    if (isNaN(mealId)) {
      return res.status(400).json({ error: "Invalid meal ID" });
    }

    // STEP 3: Query meal details with foods
    // First, check if meal exists and belongs to user
    const mealCheckQuery = `
      SELECT 
        id,
        user_id,
        name,
        meal_type,
        meal_date,
        is_template,
        created_at,
        updated_at
      FROM meals
      WHERE id = $1
    `;

    const mealCheckResult = await pool.query(mealCheckQuery, [mealId]);

    // Check if meal exists
    if (mealCheckResult.rows.length === 0) {
      return res.status(404).json({ error: "Meal not found" });
    }

    const meal = mealCheckResult.rows[0];

    // Check if meal belongs to the authenticated user
    if (meal.user_id !== userId) {
      return res.status(404).json({ error: "Meal not found" });
    }

    // STEP 4: Get all foods in the meal with complete nutrition data
    const foodsQuery = `
      SELECT 
        mf.id,
        mf.food_id,
        mf.servings,
        mf.quantity_g,
        f.name,
        f.category,
        f.protein_per_100g,
        f.fat_per_100g,
        f.carbs_per_100g,
        f.calories_per_100g
      FROM meal_foods mf
      JOIN foods f ON mf.food_id = f.id
      WHERE mf.meal_id = $1
      ORDER BY mf.created_at ASC
    `;

    const foodsResult = await pool.query(foodsQuery, [mealId]);

    // STEP 5: Calculate nutrition values for each food and totals
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;
    let totalCalories = 0;

    const foods: FoodInMeal[] = foodsResult.rows.map((food: any) => {
      // Calculate grams: use quantity_g if provided, otherwise assume 100g per serving
      const grams =
        food.quantity_g || (food.servings ? food.servings * 100 : 0);
      const multiplier = grams / 100;

      // Calculate actual nutrition values based on the amount consumed
      const actualProtein = food.protein_per_100g * multiplier;
      const actualFat = food.fat_per_100g * multiplier;
      const actualCarbs = food.carbs_per_100g * multiplier;
      const actualCalories = food.calories_per_100g * multiplier;

      // Add to totals
      totalProtein += actualProtein;
      totalFat += actualFat;
      totalCarbs += actualCarbs;
      totalCalories += actualCalories;

      return {
        id: food.id,
        food_id: food.food_id,
        name: food.name,
        category: food.category,
        servings: food.servings,
        quantity_g: food.quantity_g,
        protein_per_100g: parseFloat(food.protein_per_100g),
        fat_per_100g: parseFloat(food.fat_per_100g),
        carbs_per_100g: parseFloat(food.carbs_per_100g),
        calories_per_100g: parseFloat(food.calories_per_100g),
        actual_protein: Math.round(actualProtein * 100) / 100,
        actual_fat: Math.round(actualFat * 100) / 100,
        actual_carbs: Math.round(actualCarbs * 100) / 100,
        actual_calories: Math.round(actualCalories * 100) / 100,
      };
    });

    // STEP 6: Prepare response with complete meal details
    const mealDetail: MealDetail = {
      id: meal.id,
      user_id: meal.user_id,
      name: meal.name,
      meal_type: meal.meal_type,
      meal_date: meal.meal_date,
      is_template: meal.is_template,
      created_at: meal.created_at,
      updated_at: meal.updated_at,
      foods: foods,
      totals: {
        total_protein: Math.round(totalProtein * 100) / 100,
        total_fat: Math.round(totalFat * 100) / 100,
        total_carbs: Math.round(totalCarbs * 100) / 100,
        total_calories: Math.round(totalCalories * 100) / 100,
      },
    };

    res.status(200).json(mealDetail);
  } catch (error) {
    console.error("Get meal by ID error:", error);
    res.status(500).json({ error: "Failed to retrieve meal" });
  }
};

  export const getMealPlanById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const mealPlanId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (isNaN(mealPlanId)) {
      return res.status(400).json({ error: "Invalid meal plan ID" });
    }

    // Get meal plan info
    const mealPlanQuery = `
      SELECT id, user_id, name, is_template, meal_date, created_at, updated_at
      FROM meal_plans
      WHERE id = $1 AND user_id = $2
    `;

    const mealPlanResult = await pool.query(mealPlanQuery, [mealPlanId, userId]);

    if (mealPlanResult.rows.length === 0) {
      return res.status(404).json({ error: "Meal plan not found" });
    }

    const mealPlan = mealPlanResult.rows[0];

    // Get all meals in this plan with their foods
    const mealsQuery = `
      SELECT 
        m.id as meal_id,
        m.meal_type,
        mf.id as meal_food_id,
        mf.food_id,
        mf.quantity_g,
        f.name,
        f.category,
        f.protein_per_100g,
        f.fat_per_100g,
        f.carbs_per_100g,
        f.calories_per_100g
      FROM meals m
      LEFT JOIN meal_foods mf ON m.id = mf.meal_id
      LEFT JOIN foods f ON mf.food_id = f.id
      WHERE m.meal_plan_id = $1
      ORDER BY 
        CASE m.meal_type
          WHEN 'breakfast' THEN 1
          WHEN 'lunch' THEN 2
          WHEN 'dinner' THEN 3
          WHEN 'snack' THEN 4
        END,
        mf.created_at
    `;

    const mealsResult = await pool.query(mealsQuery, [mealPlanId]);

    // Group foods by meal type
    const groupedMeals = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    mealsResult.rows.forEach((row: any) => {
      if (row.food_id) {  // Only add if there's actually a food
        const food = {
          id: row.food_id,
          name: row.name,
          category: row.category,
          serving: row.quantity_g / 100,  // Convert back to serving units
          protein_per_100g: parseFloat(row.protein_per_100g),
          fat_per_100g: parseFloat(row.fat_per_100g),
          carbs_per_100g: parseFloat(row.carbs_per_100g),
          calories_per_100g: parseFloat(row.calories_per_100g),
        };
        groupedMeals[row.meal_type].push(food);
      }
    });

    res.status(200).json({
      ...mealPlan,
      meals: groupedMeals,
    });
  } catch (error) {
    console.error("Get meal plan error:", error);
    res.status(500).json({ error: "Failed to retrieve meal plan" });
  }
};