import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./utils/db";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// TODO: Add user routes here when ready
// app.use('/api/users', userRoutes);

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
