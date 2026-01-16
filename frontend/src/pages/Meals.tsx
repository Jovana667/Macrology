import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMeals } from "../services/api";
import { Meal } from "../types";

function Meals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const data = await getMeals();
        setMeals(data.meals || data);
        setError(null);
      } catch (err) {
        setError("Failed to load meals");
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Saved Meals</h1>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </header>

        {loading && (
          <div className="text-center text-gray-500 py-8">Loading meals...</div>
        )}

        {error && (
          <div className="text-center text-red-500 py-8">{error}</div>
        )}

        {!loading && !error && meals.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No saved meals yet. Go build one!
          </div>
        )}

        {!loading && !error && meals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal: any) => (
              <div key={meal.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-lg mb-2">{meal.name}</h3>
                <p className="text-gray-600">Type: {meal.meal_type || "N/A"}</p>
                <p className="text-gray-600">Foods: {meal.food_count || 0}</p>
                <p className="text-gray-500 text-sm">
                  Created: {new Date(meal.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Meals;
