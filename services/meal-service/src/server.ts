import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./utils/db";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// TODO: Add meal routes here when ready
// app.use('/api/meals', mealRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "meal-service" });
});

async function testDatabaseConnection() {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}

testDatabaseConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Meal service running on port ${PORT}`);
  });
});

export default app;
