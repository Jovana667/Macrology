import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getFoods, createMeal } from "../services/api";


function MealPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const [foods, setFoods] = useState<any[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCounts, setVisibleCounts] = useState({
  protein: 15,
  carbs: 15,
  fats: 15,
});


  const calculateGrandTotal = (metric) => {
    return (
      calculateMealTotal("breakfast", metric) +
      calculateMealTotal("lunch", metric) +
      calculateMealTotal("dinner", metric) +
      calculateMealTotal("snack", metric)
    );
  };

    const loadMore = (category: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof prev] + 15,
    }));
  };

  const showLess = (category: string) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [category]: 15, // Reset to 15
    }));
  };

  const toggleCategory = (category: string) => {
  if (expandedCategories.includes(category)) {
    setExpandedCategories(expandedCategories.filter((c) => c !== category));
  } else {
    setExpandedCategories([...expandedCategories, category]);
  }
};

const addFoodToMeal = (food: any) => {
  // Define what happens when you add food
  console.log("Adding food:", food);
};

  const filteredFoods = foods.filter((f) =>
  f.name.toLowerCase().includes(searchTerm.toLowerCase())
);

    const groupedFoods = {
    protein: filteredFoods.filter((f) => f.category === "protein"),
    carbs: filteredFoods.filter((f) => f.category === "carbs"),
    fats: filteredFoods.filter((f) => f.category === "fats"),
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
          <h1 className="text-3xl font-bold text-gray-900">Macrology</h1>
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
                      <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {mealPlan.name}
            </h1>
            <p className="text-gray-600">
              Created: {new Date(mealPlan.created_at).toLocaleDateString()}
            </p>
          </div>
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
              <div className="mt-6 pt-6 ">
                <h3 className="font-semibold text-lg">
                  Calories: {calculateGrandTotal("calories").toFixed(1)} cal,
                  Protein: {calculateGrandTotal("protein").toFixed(1)}g, 
                  Carbs:{" "} {calculateGrandTotal("carbs").toFixed(1)}g, 
                  Fats:{" "} {calculateGrandTotal("fat").toFixed(1)}g
                </h3>
              </div>
            </div>
</div> 

   {/* Right side - 1/3 width */}
        <div className="order-1 lg:order-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Foods</h2>
             {/* Protein Category */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory("protein")}
                className="w-full flex justify-between items-center p-2 hover:bg-gray-100 rounded"
              >
                <span className="font-medium">
                  ➕ Protein ({groupedFoods.protein.length})
                </span>
              </button>

              {expandedCategories.includes("protein") && (
                <div className="mt-2 space-y-1">
                  {groupedFoods.protein
                    .slice(0, visibleCounts.protein)
                    .map((food) => (
                      <div
                        key={food.id}
                        onClick={() => addFoodToMeal(food)}
                        className="p-2 hover:bg-blue-50 cursor-pointer rounded text-sm"
                      >
                        <div className="font-medium">{food.name}</div>
                        <div className="text-xs text-gray-600">
                          {food.protein_per_100g}g P | {food.carbs_per_100g}g C
                          | {food.fat_per_100g}g F | {food.calories_per_100g}{" "}
                          cal
                        </div>
                      </div>
                    ))}

                  {groupedFoods.protein.length > visibleCounts.protein && (
                    <button
                      onClick={() => loadMore("protein")}
                      className="w-full text-blue-600 hover:text-blue-800 text-sm py-2"
                    >
                      Load More (
                      {groupedFoods.protein.length - visibleCounts.protein}{" "}
                      more)
                    </button>
                  )}

                  {groupedFoods.protein.length <= visibleCounts.protein &&
                    groupedFoods.protein.length > 15 && (
                      <button
                        onClick={() => showLess("protein")}
                        className="w-full text-blue-600 hover:text-blue-800 text-sm py-2"
                      >
                        Show Less
                      </button>
                    )}

                  {/* If all items shown AND more than 15 → Show Less */}
                  {groupedFoods.protein.length <= visibleCounts.protein &&
                    groupedFoods.protein.length > 15 && (
                      <button onClick={() => showLess("protein")}>
                        Show Less
                      </button>
                    )}
                </div>
              )}
            </div>

            {/* Carbs Category */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory("carbs")}
                className="w-full flex justify-between items-center p-2 hover:bg-gray-100 rounded"
              >
                <span className="font-medium">
                  ➕ Carbs ({groupedFoods.carbs.length})
                </span>
              </button>

              {expandedCategories.includes("carbs") && (
                <div className="mt-2 space-y-1">
                  {groupedFoods.carbs
                    .slice(0, visibleCounts.carbs)
                    .map((food) => (
                      <div
                        key={food.id}
                        onClick={() => addFoodToMeal(food)}
                        className="p-2 hover:bg-blue-50 cursor-pointer rounded text-sm"
                      >
                        <div className="font-medium">{food.name}</div>
                        <div className="text-xs text-gray-600">
                          {food.protein_per_100g}g P | {food.carbs_per_100g}g C
                          | {food.fat_per_100g}g F | {food.calories_per_100g}{" "}
                          cal
                        </div>
                      </div>
                    ))}

                  {groupedFoods.carbs.length > visibleCounts.carbs && (
                    <button
                      onClick={() => loadMore("carbs")}
                      className="w-full text-blue-600 hover:text-blue-800 text-sm py-2"
                    >
                      Load More (
                      {groupedFoods.carbs.length - visibleCounts.carbs} more)
                    </button>
                  )}

                  {groupedFoods.carbs.length <= visibleCounts.carbs &&
                    groupedFoods.carbs.length > 15 && (
                      <button
                        onClick={() => showLess("carbs")}
                        className="w-full text-blue-600 hover:text-blue-800 text-sm py-2"
                      >
                        Show Less
                      </button>
                    )}
                </div>
              )}
            </div>

            {/* Fats Category */}
            <div className="mb-4">
              <button
                onClick={() => toggleCategory("fats")}
                className="w-full flex justify-between items-center p-2 hover:bg-gray-100 rounded"
              >
                <span className="font-medium">
                  ➕ Fats ({groupedFoods.fats.length})
                </span>
              </button>

              {expandedCategories.includes("fats") && (
                <div className="mt-2 space-y-1">
                  {groupedFoods.fats
                    .slice(0, visibleCounts.fats)
                    .map((food) => (
                      <div
                        key={food.id}
                        onClick={() => addFoodToMeal(food)}
                        className="p-2 hover:bg-blue-50 cursor-pointer rounded text-sm"
                      >
                        <div className="font-medium">{food.name}</div>
                        <div className="text-xs text-gray-600">
                          {food.protein_per_100g}g P | {food.carbs_per_100g}g C
                          | {food.fat_per_100g}g F | {food.calories_per_100g}{" "}
                          cal
                        </div>
                      </div>
                    ))}

                  {groupedFoods.fats.length > visibleCounts.fats && (
                    <button
                      onClick={() => loadMore("fats")}
                      className="w-full text-blue-600 hover:text-blue-800 text-sm py-2"
                    >
                      Load More ({groupedFoods.fats.length - visibleCounts.fats}{" "}
                      more)
                    </button>
                  )}

                  {groupedFoods.fats.length <= visibleCounts.fats &&
                    groupedFoods.fats.length > 15 && (
                      <button
                        onClick={() => showLess("fats")}
                        className="w-full text-blue-600 hover:text-blue-800 text-sm py-2"
                      >
                        Show Less
                      </button>
                    )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      </div>
    
  );
}

export default MealPlanDetail;
