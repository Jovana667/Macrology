import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFoods, createMeal } from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mealName, setMealName] = useState("");
  const [visibleCounts, setVisibleCounts] = useState({
    protein: 15,
    carbs: 15,
    fats: 15,
  });
  const [selectedMeal, setSelectedMeal] = useState<string>("breakfast"); // which meal is active
  const [mealFoods, setMealFoods] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  });

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

  const clearSearch = () => {
    setSearchTerm("");
  };

  const addFoodToMeal = (food: any) => {
    console.log(`Adding ${food.name} to ${selectedMeal}`);
    const foodWithServing = { ...food, serving: 1 }; // Default serving size to 1
    setMealFoods({
      ...mealFoods,
      [selectedMeal]: [
        ...mealFoods[selectedMeal as keyof typeof mealFoods],
        foodWithServing,
      ],
    });
    console.log("Updated mealFoods:", mealFoods);
  };

  const updateFoodServing = (
    mealType: string,
    foodIndex: number,
    newServing: string,
  ) => {
    // Copy the entire mealFoods object
    const updatedMealFoods = { ...mealFoods };

    // Copy the specific meal's array
    const updatedMeal = [...mealFoods[mealType as keyof typeof mealFoods]];

    // Update the specific food at foodIndex
    updatedMeal[foodIndex] = {
      ...updatedMeal[foodIndex],
      serving: parseFloat(newServing) || 0,
    };

    // Update the meal in the mealFoods object
    updatedMealFoods[mealType as keyof typeof mealFoods] = updatedMeal;

    // Set the new state
    setMealFoods(updatedMealFoods);
  };

  const removeFoodFromMeal = (mealType: string, foodIndex: number) => {
    const updatedMealFoods = { ...mealFoods };
    const updatedMeal = [...mealFoods[mealType as keyof typeof mealFoods]];

    // Remove the food at the specified index
    updatedMeal.splice(foodIndex, 1);

    updatedMealFoods[mealType as keyof typeof mealFoods] = updatedMeal;
    setMealFoods(updatedMealFoods);
  };

  const calculateMealTotal = (mealType: string, metric: string) => {
    return mealFoods[mealType].reduce((total, food) => {
      return total + food[`${metric}_per_100g`] * food.serving;
    }, 0);
  };

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const groupedFoods = {
    protein: filteredFoods.filter((f) => f.category === "protein"),
    carbs: filteredFoods.filter((f) => f.category === "carbs"),
    fats: filteredFoods.filter((f) => f.category === "fats"),
  };

  const calculateGrandTotal = (metric) => {
    return (
      calculateMealTotal("breakfast", metric) +
      calculateMealTotal("lunch", metric) +
      calculateMealTotal("dinner", metric) +
      calculateMealTotal("snack", metric)
    );
  };

  const handleSaveMeal = async () => {
    // Step 1: Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save your meal.");
      return;
    }
    // Step 2: Transform mealFoods to backend format
    const transformedFoods = {
      breakfast: mealFoods.breakfast.map((food) => ({
        food_id: food.id,
        quantity_g: food.serving * 100,
      })),
      lunch: mealFoods.lunch.map((food) => ({
        food_id: food.id,
        quantity_g: food.serving * 100,
      })),
      dinner: mealFoods.dinner.map((food) => ({
        food_id: food.id,
        quantity_g: food.serving * 100,
      })),
      snack: mealFoods.snack.map((food) => ({
        food_id: food.id,
        quantity_g: food.serving * 100,
      })),
    };

    // Step 3: Prepare the meal data
    const mealData = {
      name: mealName,
      is_template: true,
      meal_date: new Date().toISOString().split("T")[0], // Today's date
      foods: transformedFoods,
    };
    if (!mealName.trim()) {
      alert("Please enter a meal plan name");
      return;
    }
      console.log('Sending meal data:', JSON.stringify(mealData, null, 2));

    // Step 4: Send to backend
    try {
      const response = await createMeal(mealData);
      alert("Meal saved successfully!");
      // clear form
      setMealFoods({
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
      });
    } catch (error) {
      alert("Failed to save meal");
      console.error("Error saving meal:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const data = await getFoods();
        console.log("Foods fetched successfully:", data);
        setFoods(data.foods || []); // Access data.foods array
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      } finally {
        setLoading(false);
      }
    };

    console.log(groupedFoods.protein);

    fetchFoods();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Macrology</h1>
          <div className="space-x-4">
            <Link to="/meals" className="text-blue-600 hover:text-blue-800">
              Saved Meals
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Log Out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Meal Planner (2/3 width) */}
          <div className="lg:col-span-2 order-2 lg:order-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Meal Planner</h2>

            {/* Meal Name Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter meal plan name (e.g., Summer Cut Week 1)"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Placeholder for meal structure */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  <h3>
                    Breakfast:{" "}
                    {calculateMealTotal("breakfast", "calories").toFixed(1)}{" "}
                    cal, {calculateMealTotal("breakfast", "protein").toFixed(1)}
                    g protein,{" "}
                    {calculateMealTotal("breakfast", "carbs").toFixed(1)}g
                    carbs, {calculateMealTotal("breakfast", "fat").toFixed(1)}g
                    fats
                  </h3>{" "}
                </h3>
                <div
                  className={`border-2 border-dashed rounded p-4 cursor-pointer ${
                    selectedMeal === "breakfast"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 text-gray-400"
                  }`}
                  onClick={() => setSelectedMeal("breakfast")}
                >
                  {mealFoods.breakfast.length === 0 ? (
                    <p className="text-gray-400">Drop foods here</p>
                  ) : (
                    mealFoods.breakfast.map((food: any, index: number) => (
                      <div
                        key={`${food.id}-${index}`}
                        className="text-sm mb-1 text-gray-800 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{food.name}</div>
                          <input
                            type="number"
                            value={food.serving}
                            onChange={(e) =>
                              updateFoodServing(
                                "breakfast",
                                index,
                                e.target.value,
                              )
                            }
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <p>
                            Calories:{" "}
                            {(food.calories_per_100g * food.serving).toFixed(1)}
                          </p>
                          <p>
                            Protein:{" "}
                            {(food.protein_per_100g * food.serving).toFixed(1)}g
                          </p>
                          <p>
                            Carbs:{" "}
                            {(food.carbs_per_100g * food.serving).toFixed(1)}g
                          </p>
                          <p>
                            Fats:{" "}
                            {(food.fat_per_100g * food.serving).toFixed(1)}g
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFoodFromMeal("breakfast", index);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  <h3>
                    Lunch: {calculateMealTotal("lunch", "calories").toFixed(1)}{" "}
                    cal, {calculateMealTotal("lunch", "protein").toFixed(1)}g
                    protein, {calculateMealTotal("lunch", "carbs").toFixed(1)}g
                    carbs, {calculateMealTotal("lunch", "fat").toFixed(1)}g fats
                  </h3>{" "}
                </h3>
                <div
                  className={`border-2 border-dashed rounded p-4 cursor-pointer ${
                    selectedMeal === "lunch"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 text-gray-400"
                  }`}
                  onClick={() => setSelectedMeal("lunch")}
                >
                  {mealFoods.lunch.length === 0 ? (
                    <p className="text-gray-400">Drop foods here</p>
                  ) : (
                    mealFoods.lunch.map((food: any, index: number) => (
                      <div
                        key={`${food.id}-${index}`}
                        className="text-sm mb-1 text-gray-800 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{food.name}</div>
                          <input
                            type="number"
                            value={food.serving}
                            onChange={(e) =>
                              updateFoodServing("lunch", index, e.target.value)
                            }
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <p>
                            Calories:{" "}
                            {(food.calories_per_100g * food.serving).toFixed(1)}
                          </p>
                          <p>
                            Protein:{" "}
                            {(food.protein_per_100g * food.serving).toFixed(1)}g
                          </p>
                          <p>
                            Carbs:{" "}
                            {(food.carbs_per_100g * food.serving).toFixed(1)}g
                          </p>
                          <p>
                            Fats:{" "}
                            {(food.fat_per_100g * food.serving).toFixed(1)}g
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFoodFromMeal("lunch", index);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  <h3>
                    Dinner:{" "}
                    {calculateMealTotal("dinner", "calories").toFixed(1)} cal,{" "}
                    {calculateMealTotal("dinner", "protein").toFixed(1)}g
                    protein, {calculateMealTotal("dinner", "carbs").toFixed(1)}g
                    carbs, {calculateMealTotal("dinner", "fat").toFixed(1)}g
                    fats
                  </h3>{" "}
                </h3>
                <div
                  className={`border-2 border-dashed rounded p-4 cursor-pointer ${
                    selectedMeal === "dinner"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 text-gray-400"
                  }`}
                  onClick={() => setSelectedMeal("dinner")}
                >
                  {mealFoods.dinner.length === 0 ? (
                    <p className="text-gray-400">Drop foods here</p>
                  ) : (
                    mealFoods.dinner.map((food: any, index: number) => (
                      <div
                        key={`${food.id}-${index}`}
                        className="text-sm mb-1 text-gray-800 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{food.name}</div>
                          <input
                            type="number"
                            value={food.serving}
                            onChange={(e) =>
                              updateFoodServing("dinner", index, e.target.value)
                            }
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <p>
                            Calories:{" "}
                            {(food.calories_per_100g * food.serving).toFixed(1)}
                          </p>
                          <p>
                            Protein:{" "}
                            {(food.protein_per_100g * food.serving).toFixed(1)}g
                          </p>
                          <p>
                            Carbs:{" "}
                            {(food.carbs_per_100g * food.serving).toFixed(1)}g
                          </p>
                          <p>
                            Fats:{" "}
                            {(food.fat_per_100g * food.serving).toFixed(1)}g
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFoodFromMeal("dinner", index);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  <h3>
                    Snack: {calculateMealTotal("snack", "calories").toFixed(1)}{" "}
                    cal, {calculateMealTotal("snack", "protein").toFixed(1)}g
                    protein, {calculateMealTotal("snack", "carbs").toFixed(1)}g
                    carbs, {calculateMealTotal("snack", "fat").toFixed(1)}g fats
                  </h3>{" "}
                </h3>
                <div
                  className={`border-2 border-dashed rounded p-4 cursor-pointer ${
                    selectedMeal === "snack"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 text-gray-400"
                  }`}
                  onClick={() => setSelectedMeal("snack")}
                >
                  {mealFoods.snack.length === 0 ? (
                    <p className="text-gray-400">Drop foods here</p>
                  ) : (
                    mealFoods.snack.map((food: any, index: number) => (
                      <div
                        key={`${food.id}-${index}`}
                        className="text-sm mb-1 text-gray-800 flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{food.name}</div>
                          <input
                            type="number"
                            value={food.serving}
                            onChange={(e) =>
                              updateFoodServing("snack", index, e.target.value)
                            }
                            className="w-20 px-2 py-1 border rounded"
                          />
                          <p>
                            Calories:{" "}
                            {(food.calories_per_100g * food.serving).toFixed(1)}
                          </p>
                          <p>
                            Protein:{" "}
                            {(food.protein_per_100g * food.serving).toFixed(1)}g
                          </p>
                          <p>
                            Carbs:{" "}
                            {(food.carbs_per_100g * food.serving).toFixed(1)}g
                          </p>
                          <p>
                            Fats:{" "}
                            {(food.fat_per_100g * food.serving).toFixed(1)}g
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFoodFromMeal("snack", index);
                          }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button 
              onClick={handleSaveMeal}
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                Save Meal
              </button>
              {/* Grand Total */}
              <div className="mt-6 pt-6 ">
                <h3 className="font-semibold text-lg">
                  Calories: {calculateGrandTotal("calories").toFixed(1)} cal,
                  Protein: {calculateGrandTotal("protein").toFixed(1)}g, Carbs:{" "}
                  {calculateGrandTotal("carbs").toFixed(1)}g, Fats:{" "}
                  {calculateGrandTotal("fat").toFixed(1)}g
                </h3>
              </div>
            </div>
          </div>

          {/* Right side - Food Sidebar (1/3 width) */}
          <div className="order-1 lg:order-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Foods</h2>

            {/* Search Input with Clear Button */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Show loading message */}
            {loading && (
              <div className="text-center text-gray-500 py-4">
                Loading foods...
              </div>
            )}

            {/* Show no foods found message */}
            {!loading && searchTerm && filteredFoods.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No foods found.
              </div>
            )}

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

export default Home;
