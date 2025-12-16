// csv-to-json.js
const fs = require("fs");

function autoDetectCategory(protein, carbs, fat) {
  // Convert to numbers
  const p = parseFloat(protein) || 0;
  const c = parseFloat(carbs) || 0;
  const f = parseFloat(fat) || 0;

  // Auto-categorize based on macros
  // If protein is highest, it's a protein food
  if (p > c && p > f && p > 10) {
    return "protein";
  }
  // If fat is highest and over 20g, it's a fat
  else if (f > 20 || (f > p && f > c && f > 10)) {
    return "fats";
  }
  // Otherwise it's a carb
  else {
    return "carbs";
  }
}

function csvToJson(csvFilePath) {
  const csv = fs.readFileSync(csvFilePath, "utf8");
  const lines = csv
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  // Skip header row
  const dataLines = lines.slice(1);

  const foods = {
    proteins: [],
    carbs: [],
    fats: [],
  };

  for (const line of dataLines) {
    const values = line.split(",").map((v) => v.trim());

    // Skip if not enough data
    if (values.length < 6) continue;

    const [name, category, protein, carbs, fat, calories] = values;

    // Skip if name is empty
    if (!name) continue;

    // Auto-detect category if empty
    const detectedCategory =
      category || autoDetectCategory(protein, carbs, fat);

    const foodItem = {
      name: name,
      category: detectedCategory,
      protein_per_100g: parseFloat(protein) || 0,
      carbs_per_100g: parseFloat(carbs) || 0,
      fat_per_100g: parseFloat(fat) || 0,
      calories_per_100g: parseFloat(calories) || 0,
    };

    // Add to appropriate category
    if (detectedCategory === "protein") {
      foods.proteins.push(foodItem);
    } else if (detectedCategory === "carbs") {
      foods.carbs.push(foodItem);
    } else if (detectedCategory === "fats") {
      foods.fats.push(foodItem);
    }
  }

  fs.writeFileSync("./foods.json", JSON.stringify(foods, null, 2));
  console.log(`✅ Converted ${dataLines.length} foods to foods.json!`);
  console.log(`   - ${foods.proteins.length} proteins`);
  console.log(`   - ${foods.carbs.length} carbs`);
  console.log(`   - ${foods.fats.length} fats`);
}

// Run it
csvToJson("./foods.csv");
