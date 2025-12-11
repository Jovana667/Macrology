export interface Food {
  id: number;
  name: string;
  category: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  serving_size: number;
  created_at: Date;
}

export interface FoodQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}