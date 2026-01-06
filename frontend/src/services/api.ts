import axios from 'axios';

// Create an instance with base configuration
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,  
  headers: {
    'Content-Type': 'application/json'
  }
});

const mealApi = axios.create({
  baseURL: import.meta.env.VITE_MEAL_API_URL,  
  headers: {
    'Content-Type': 'application/json'
  }
});

const foodApi = axios.create({
  baseURL: import.meta.env.VITE_FOOD_API_URL,  
  headers: {
    'Content-Type': 'application/json'
  }
});

const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,  
  headers: {
    'Content-Type': 'application/json'
  }
});


// Authentication
export const login = async (email: string, password: string) => {
  const response = await authApi.post('/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await authApi.post('/register', { email, password });
  return response.data;
};