import { Request, Response } from "express";
import pool from "../utils/db";

export const getFoods = async (req: Request, res: Response) => {
  try {
    // STEP 1: Extract query parameters from the URL
    // Example: /api/foods?category=Protein&search=chicken&page=2&pageSize=20
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const page = parseInt(req.query.page as string) || 1; // Default: page 1
    const pageSize = parseInt(req.query.pageSize as string) || 20; // Default: 20 items

    // STEP 2: Calculate pagination values
    // If page=1, pageSize=20 → skip 0 items (first 20)
    // If page=2, pageSize=20 → skip 20 items (items 21-40)
    // If page=3, pageSize=20 → skip 40 items (items 41-60)
    const offset = (page - 1) * pageSize;

    // STEP 3: Build the WHERE conditions dynamically
    // We need to add filters only if they're provided
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Add category filter if provided
    if (category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    // Add search filter if provided
    // ILIKE is case-insensitive LIKE in PostgreSQL
    // %search% means "contains this text anywhere"
    if (search) {
      conditions.push(`name ILIKE $${paramIndex++}`);
      params.push(`%${search}%`);
    }

    // Build the WHERE clause
    // If conditions = ['category = $1', 'name ILIKE $2']
    // Result: "WHERE category = $1 AND name ILIKE $2"
    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

    // STEP 4: Query to get the foods (with pagination and filters)
    const foodsQuery = `
      SELECT 
        id,
        name,
        category,
        protein_per_100g,
        fat_per_100g,
        carbs_per_100g,
        calories_per_100g,
        created_at,
        updated_at
      FROM foods
      ${whereClause}
      ORDER BY name ASC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;

    // Add pagination parameters to the params array
    params.push(pageSize, offset);

    // Execute the query
    const foodsResult = await pool.query(foodsQuery, params);

    // STEP 5: Query to get the total count (without pagination)
    // We need this so the frontend knows how many pages there are
    const countQuery = `
      SELECT COUNT(*) as total
      FROM foods
      ${whereClause}
    `;

    // Use the same params but WITHOUT the pageSize and offset
    const countParams = params.slice(0, params.length - 2);
    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    // STEP 6: Send the response
    res.status(200).json({
      foods: foodsResult.rows, // Array of food objects
      total: total, // Total number of foods matching filters
      page: page, // Current page number
      pageSize: pageSize, // Number of items per page
      totalPages: Math.ceil(total / pageSize), // Total number of pages
    });
  } catch (error) {
    console.error("Get foods error:", error);
    res.status(500).json({ error: "Failed to retrieve foods" });
  }
};
