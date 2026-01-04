export interface JWTPayload {
  id: number;
  email: string;
}

export interface CreatenutritionGoalRequest {
  target_calories?: number;
  target_protein_g?: number;
  target_fat_g?: number;
  target_carbs_g?: number;
  dietary_restrictions?: string;
}