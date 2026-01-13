import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getFoods } from "../services/api";

function Home() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCounts, setVisibleCounts] = useState({
    protein: 15,
    carbs: 15,
    fats: 15,
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

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
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

    fetchFoods();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Macrology</h1>
          <div className="space-x-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Meal Planner (2/3 width) */}
          <div className="lg:col-span-2 order-2 lg:order-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Meal Planner</h2>

            {/* Placeholder for meal structure */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Breakfast: 0 cal</h3>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-gray-400">
                  Drop foods here
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Lunch: 0 cal</h3>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-gray-400">
                  Drop foods here
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Dinner: 0 cal</h3>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-gray-400">
                  Drop foods here
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Snack: 0 cal</h3>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-gray-400">
                  Drop foods here
                </div>
              </div>
            </div>

            <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Save Meal
            </button>
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
