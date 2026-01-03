calculateMealMacros = (meal) => {
  // input validation
  if (!meal || !Array.isArray(meal.items)) {
    return { calories: 0, protein: 0, carbs: 0, fats: 0 };
  }

  // check if items array is empty
  if (meal.items.length === 0) {
    return { calories: 0, protein: 0, carbs: 0, fats: 0 };
  }

  const foodMacros = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  };

  meal.items.forEach((item) => {
    // skip if no valid quantity
    if (!item.quantity_g && !item.servings) {
      return;
    }

    // calculare grams from quantity_g or servings
    const grams = item.quantity_g || (item.servings ? item.servings * 100 : 0);

    // calculate multiplier
    const multiplier = grams / 100;

    // calculate actual nutrients using per 100g values
    const actualProtein = (item.protein_per_100g || 0) * multiplier;
    const actualCarbs = (item.carbs_per_100g || 0) * multiplier;
    const actualFats = (item.fat_per_100g || 0) * multiplier;
    const actualCalories = (item.calories_per_100g || 0) * multiplier;

    // add to totals
    foodMacros.protein += actualProtein;
    foodMacros.carbs += actualCarbs;
    foodMacros.fats += actualFats;
    foodMacros.calories += actualCalories;
  });
  return {
    calories: Math.round(foodMacros.calories * 100) / 100,
    protein: Math.round(foodMacros.protein * 100) / 100,
    carbs: Math.round(foodMacros.carbs * 100) / 100,
    fats: Math.round(foodMacros.fats * 100) / 100,
  };
};

calculateMacroPercentage = (totalMacros) => {
  const { calories, protein, carbs, fats } = totalMacros;
  if (calories === 0) {
    return { proteinPercent: 0, carbsPercent: 0, fatsPercent: 0 };
  }
  const proteinPercent = ((protein * 4) / calories) * 100;
  const carbsPercent = ((carbs * 4) / calories) * 100;
  const fatsPercent = ((fats * 9) / calories) * 100;

  return {
    proteinPercent: parseFloat(proteinPercent.toFixed(2)),
    carbsPercent: parseFloat(carbsPercent.toFixed(2)),
    fatsPercent: parseFloat(fatsPercent.toFixed(2)),
  };
};

module.exports = {
  calculateMealMacros,
  calculateMacroPercentage,
};
