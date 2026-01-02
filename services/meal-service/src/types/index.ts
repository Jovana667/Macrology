export interface JWTPayload {
  id: number;
  email: string;
}

export interface CreateMealRequest {
  name: string;
  meal_type?: string;
  meal_date?: string;
  is_template?: boolean;
  foods: MealFoodItem[];
}

export interface MealFoodItem {
  food_id: number;
  servings?: number;
  quantity_g?: number;
}

export interface Food {
  id: number;
  name: string;
  category: string;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
  calories_per_100g: number;
}

export interface MealTotals {
  total_protein: number;
  total_fat: number;
  total_carbs: number;
  total_calories: number;
}

export interface FoodInMeal {
  id: number;
  food_id: number;
  name: string;
  category: string;
  servings: number | null;
  quantity_g: number | null;
  protein_per_100g: number;
  fat_per_100g: number;
  carbs_per_100g: number;
  calories_per_100g: number;
  actual_protein: number;
  actual_fat: number;
  actual_carbs: number;
  actual_calories: number;
}

export interface MealDetail {
  id: number;
  user_id: number;
  name: string;
  meal_type: string | null;
  meal_date: string | null;
  is_template: boolean;
  created_at: string;
  updated_at: string;
  foods: FoodInMeal[];
  totals: MealTotals;
}
