const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    const foodsData = JSON.parse(fs.readFileSync('./foods.json', 'utf8'));
    
    // Combine all food categories
    const allFoods = [
      ...foodsData.proteins,
      ...foodsData.carbs,
      // Add more categories as you expand
    ];

    for (const food of allFoods) {
      await pool.query(
        `INSERT INTO foods (name, category, protein, carbs, fat, calories, serving_size)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [food.name, food.category, food.protein, food.carbs, food.fat, food.calories, food.serving_size]
      );
    }

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();