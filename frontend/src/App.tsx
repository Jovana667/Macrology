import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Meals from "./pages/Meals";
import MealPlanDetail from "./pages/MealPlanDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/meals" element={
          <ProtectedRoute>
            <Meals />
          </ProtectedRoute>
        } />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/meal-plan/:id" element={<MealPlanDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
