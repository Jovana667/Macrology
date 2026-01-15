import axios from "axios";

// Create an instance with base configuration
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const mealApi = axios.create({
  baseURL: import.meta.env.VITE_MEAL_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const foodApi = axios.create({
  baseURL: import.meta.env.VITE_FOOD_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to automatically add token to requests
const addTokenInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

// Apply interceptor to all instances that need authentication
addTokenInterceptor(userApi);
addTokenInterceptor(mealApi);
addTokenInterceptor(foodApi);
// authApi doesn't need it (login/register don't require tokens)

// Authentication
export const login = async (email: string, password: string) => {
  const response = await authApi.post("/login", { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await authApi.post("/register", { email, password });
  return response.data;
};

// profile
export const getUserProfile = async () => {
  const response = await userApi.get("/profile");
  return response.data;
};

export const updateUserProfile = async (profileData: any) => {
  const response = await userApi.put("/profile", profileData);
  return response.data;
};

// meals
export const getMeals = async () => {
  const response = await mealApi.get("/meals");
  return response.data;
};

export const createMeal = async (mealData: any) => {
  const response = await mealApi.post("/meals", mealData);
  return response.data;
};

export const getMealById = async (mealId: number) => {
  const response = await mealApi.get(`/meals/${mealId}`);
  return response.data;
};

// Foods
export const getFoods = async (params?: {
  category?: string;
  search?: string;
  pageSize?: number;
}) => {
  const response = await foodApi.get("/api/foods", {
    params: { pageSize: 100, ...params },
  });
  return response.data;
};

export const searchFoods = async (query: string) => {
  const response = await foodApi.get("/api/foods/search", {
    params: { q: query },
  });
  return response.data;
};
