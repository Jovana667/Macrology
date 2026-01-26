import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Load .env FIRST before importing anything that uses it
dotenv.config();

// NOW import pool (which needs DATABASE_URL from .env)
import pool from "./utils/db";
import userRoutes from "./routes/userRoutes";

// Debug - see what's loaded
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const app: Express = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "user-service" });
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
    console.log(`🚀 User service running on port ${PORT}`);
  });
});

export default app;