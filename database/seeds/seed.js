const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../../services/auth-service/.env"),
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  try {
    const foodsData = JSON.parse(fs.readFileSync("./foods.json", "utf8"));

    // Combine all food categories
    const allFoods = [
      ...foodsData.proteins,
      ...foodsData.carbs,
      ...foodsData.fats,
    ];

    console.log(`📥 Seeding ${allFoods.length} foods...\n`);

    for (const food of allFoods) {
      try {
        const result = await pool.query(
          `INSERT INTO foods(name, category, protein_per_100g, fat_per_100g, carbs_per_100g, calories_per_100g)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (name) DO NOTHING
          RETURNING id`,
          [
            food.name,
            food.category,
            food.protein_per_100g,
            food.fat_per_100g,
            food.carbs_per_100g,
            food.calories_per_100g,
          ]
        );

        if (result.rowCount > 0) {
          successCount++;
        } else {
          skipCount++;
          console.log(`⏭️  Skipped: "${food.name}" (already exists)`);
        }
      } catch (itemError) {
        errorCount++;
        console.error(`❌ Error inserting "${food.name}":`, itemError.message);
      }
    }

    console.log("\n✅ Seeding completed!");
    console.log(`   - ${successCount} foods added`);
    console.log(`   - ${skipCount} duplicates skipped`);
    console.log(`   - ${errorCount} errors`);

    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error("❌ Fatal seeding error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
