-- Migration: Add meal template support
-- This allows users to save meal templates/recipes that can be reused

-- Add new columns to meals table
ALTER TABLE meals 
ADD COLUMN name VARCHAR(255),
ADD COLUMN is_template BOOLEAN DEFAULT FALSE NOT NULL;

-- Make meal_type and meal_date optional (templates don't need them)
ALTER TABLE meals 
ALTER COLUMN meal_type DROP NOT NULL,
ALTER COLUMN meal_date DROP NOT NULL;

-- Add servings column to meal_foods (keeps quantity_g for backward compatibility)
ALTER TABLE meal_foods 
ADD COLUMN servings DECIMAL(6,2);

-- Add indexes for better query performance
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_is_template ON meals(is_template);
CREATE INDEX idx_meal_foods_meal_id ON meal_foods(meal_id);
CREATE INDEX idx_meal_foods_food_id ON meal_foods(food_id);

-- Add comments for documentation
COMMENT ON COLUMN meals.name IS 'Custom name for the meal (e.g., "Protein Smoothie")';
COMMENT ON COLUMN meals.is_template IS 'TRUE if this is a reusable template/recipe, FALSE if it is a logged meal';
COMMENT ON COLUMN meal_foods.servings IS 'Number of servings (can be used instead of or alongside quantity_g)';
