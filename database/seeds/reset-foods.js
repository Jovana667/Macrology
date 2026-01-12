const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../services/auth-service/.env"),
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function resetFoods() {
  try {
    console.log("🗑️  Deleting all existing foods...");

    // Delete all foods
    const deleteResult = await pool.query("DELETE FROM foods");
    console.log(`   ✅ Deleted ${deleteResult.rowCount} foods\n`);

    console.log("📥 Re-seeding foods from foods.json...");

    // Read and insert foods
    const foodsData = JSON.parse(fs.readFileSync("./foods.json", "utf8"));
    const allFoods = [
      ...foodsData.proteins,
      ...foodsData.carbs,
      ...foodsData.fats,
    ];

    let successCount = 0;

    for (const food of allFoods) {
      await pool.query(
        `INSERT INTO foods(name, category, protein_per_100g, fat_per_100g, carbs_per_100g, calories_per_100g)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          food.name,
          food.category,
          food.protein_per_100g,
          food.fat_per_100g,
          food.carbs_per_100g,
          food.calories_per_100g,
        ]
      );
      successCount++;
    }

    console.log(`   ✅ Inserted ${successCount} foods\n`);
    console.log("✨ Reset complete!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetFoods();
