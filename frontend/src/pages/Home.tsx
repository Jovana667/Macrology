import { Link } from "react-router-dom";

function Home() {
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

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Meal Planner</h2>
          <p className="text-gray-600 mb-6">
            Drag and drop interface coming soon! Build your meals and track your
            macros.
          </p>

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
      </div>
    </div>
  );
}

export default Home;
