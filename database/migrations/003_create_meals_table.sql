CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_type VARCHAR(50) NOT NULL,  -- 'Breakfast', 'Lunch', 'Dinner', 'Snack'
    meal_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meal_foods (
    id SERIAL PRIMARY KEY,
    meal_id INTEGER NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    food_id INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    quantity_g DECIMAL(6,2) NOT NULL,  -- grams of this food
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- When you build an endpoint like GET /api/meals/:id, THAT'S where you'll use that query.

-- SELECT 
--   m.meal_type,
--   SUM((f.protein_per_100g * mf.quantity_g) / 100) as total_protein,
--   SUM((f.calories_per_100g * mf.quantity_g) / 100) as total_calories
-- FROM meals m
-- JOIN meal_foods mf ON m.id = mf.meal_id
-- JOIN foods f ON mf.food_id = f.id
-- WHERE m.id = 1
-- GROUP BY m.id;