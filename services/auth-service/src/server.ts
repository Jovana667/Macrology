import express, { Express } from "express"; // Gets the web framework
import cors from "cors"; // Allows frontend to talk to backend
import dotenv from "dotenv"; // Loads .env file
import authRoutes from "./routes/authRoutes"; // Gets your login/register routes
import pool from "./utils/db";

dotenv.config(); // ← Reads .env file and loads DATABASE_URL, PORT, etc.

const app: Express = express(); // Creates your web server
const PORT = process.env.PORT || 3001; // Uses PORT from .env, or 3001 as fallback

// Middleware - these run on EVERY request
app.use(cors()); // Allows requests from your frontend
app.use(express.json()); // Lets you read JSON from request body

// Routes - defines what URLs your service responds to
app.use("/api/auth", authRoutes); // All /api/auth/* requests go to authRoutes

// Health check - a simple endpoint to test if server is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

// Create a function to test DB
async function testDatabaseConnection() {
  try {
    await pool.query("SELECT NOW()"); // Simple test query
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1); // Exit if DB is broken
  }
}

// Test DB BEFORE starting server
testDatabaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Auth service running on port ${PORT}`);
  });
});
