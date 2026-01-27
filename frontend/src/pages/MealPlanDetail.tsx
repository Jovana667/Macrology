import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function MealPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const calculateGrandTotal = (metric) => {
    return (
      calculateMealTotal("breakfast", metric) +
      calculateMealTotal("lunch", metric) +
      calculateMealTotal("dinner", metric) +
      calculateMealTotal("snack", metric)
    );
  };
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:3003/api/meals/plans/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMealPlan(response.data);
      } catch (err) {
        console.error("Error fetching meal plan:", err);
        setError("Failed to load meal plan");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [id, navigate]);

  const calculateMealTotal = (mealType: string, metric: string) => {
    const meals = mealPlan?.meals?.[mealType] || [];
    return meals.reduce((total: number, food: any) => {
      return total + food[`${metric}_per_100g`] * food.serving;
    }, 0);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!mealPlan) return <div className="p-8">Meal plan not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mealPlan.name}
            </h1>
            <p className="text-gray-600">
              Created: {new Date(mealPlan.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="space-x-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <Link
              to="/meals"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Meals
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Meal Planner (2/3 width) */}
          <div className="lg:col-span-2 order-2 lg:order-1 bg-white rounded-lg shadow p-6">
            {/* Breakfast */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Breakfast: </h2>
              <div className="space-y-2">
                {mealPlan.meals.breakfast.map((food: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      Serving: {food.serving} x 100g | Calories:{" "}
                      {(food.calories_per_100g * food.serving).toFixed(1)} |
                      Protein:{" "}
                      {(food.protein_per_100g * food.serving).toFixed(1)}g |
                      Carbs: {(food.carbs_per_100g * food.serving).toFixed(1)}g
                      | Fats: {(food.fat_per_100g * food.serving).toFixed(1)}g
                    </div>
                  </div>
                ))}
                {mealPlan.meals.breakfast.length === 0 && (
                  <p className="text-gray-400">No foods</p>
                )}
              </div>
            </div>

            {/* Lunch */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Lunch: </h2>
              <div className="space-y-2">
                {mealPlan.meals.lunch.map((food: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      Serving: {food.serving} x 100g | Calories:{" "}
                      {(food.calories_per_100g * food.serving).toFixed(1)} |
                      Protein:{" "}
                      {(food.protein_per_100g * food.serving).toFixed(1)}g |
                      Carbs: {(food.carbs_per_100g * food.serving).toFixed(1)}g
                      | Fats: {(food.fat_per_100g * food.serving).toFixed(1)}g
                    </div>
                  </div>
                ))}
                {mealPlan.meals.lunch.length === 0 && (
                  <p className="text-gray-400">No foods</p>
                )}
              </div>
            </div>

            {/* Dinner */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Dinner: </h2>
              <div className="space-y-2">
                {mealPlan.meals.dinner.map((food: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      Serving: {food.serving} x 100g | Calories:{" "}
                      {(food.calories_per_100g * food.serving).toFixed(1)} |
                      Protein:{" "}
                      {(food.protein_per_100g * food.serving).toFixed(1)}g |
                      Carbs: {(food.carbs_per_100g * food.serving).toFixed(1)}g
                      | Fats: {(food.fat_per_100g * food.serving).toFixed(1)}g
                    </div>
                  </div>
                ))}
                {mealPlan.meals.dinner.length === 0 && (
                  <p className="text-gray-400">No foods</p>
                )}
              </div>
            </div>

            {/* Snack */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Snack: </h2>
              <div className="space-y-2">
                {mealPlan.meals.snack.map((food: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{food.name}</div>
                    <div className="text-sm text-gray-600">
                      Serving: {food.serving} x 100g | Calories:{" "}
                      {(food.calories_per_100g * food.serving).toFixed(1)} |
                      Protein:{" "}
                      {(food.protein_per_100g * food.serving).toFixed(1)}g |
                      Carbs: {(food.carbs_per_100g * food.serving).toFixed(1)}g
                      | Fats: {(food.fat_per_100g * food.serving).toFixed(1)}g
                    </div>
                  </div>
                ))}
                {mealPlan.meals.snack.length === 0 && (
                  <p className="text-gray-400">No foods</p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Edit Meal
              </button>
              {/* Grand Total */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Grand Total Calories:{" "}
                  {calculateGrandTotal("calories").toFixed(1)} cal, Protein:{" "}
                  {calculateGrandTotal("protein").toFixed(1)}g, Carbs:{" "}
                  {calculateGrandTotal("carbs").toFixed(1)}g, Fats:{" "}
                  {calculateGrandTotal("fat").toFixed(1)}g
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealPlanDetail;
