import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Meal Planner
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-6">Nutrition Goals</h2>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="calories"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Calories
                </label>
                <input
                  type="number"
                  id="calories"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2000"
                />
              </div>

              <div>
                <label
                  htmlFor="protein"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Protein (g)
                </label>
                <input
                  type="number"
                  id="protein"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="150"
                />
              </div>

              <div>
                <label
                  htmlFor="carbs"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Carbs (g)
                </label>
                <input
                  type="number"
                  id="carbs"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="200"
                />
              </div>

              <div>
                <label
                  htmlFor="fats"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Fats (g)
                </label>
                <input
                  type="number"
                  id="fats"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="65"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="restrictions"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dietary Restrictions
              </label>
              <textarea
                id="restrictions"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Vegetarian, Gluten-free, Dairy-free"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
            >
              Save Goals
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
