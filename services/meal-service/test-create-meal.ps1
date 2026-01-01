# Test Create Meal Endpoint

Write-Host "=== Step 1: Login to get auth token ===" -ForegroundColor Cyan
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"test@example.com","password":"Test123!@#"}'
    
    $token = $loginResponse.token
    Write-Host "✅ Login successful! Token obtained." -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure auth-service is running on port 3001 and you have a test user" -ForegroundColor Yellow
    exit
}

Write-Host "`n=== Step 2: Create a meal with multiple foods ===" -ForegroundColor Cyan
$mealData = @{
    name = "Protein Power Breakfast"
    meal_type = "Breakfast"
    meal_date = "2026-01-01"
    is_template = $false
    foods = @(
        @{
            food_id = 1
            servings = 2
            quantity_g = 150
        },
        @{
            food_id = 2
            servings = 1
            quantity_g = 100
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $token" } `
        -ContentType "application/json" `
        -Body $mealData
    
    Write-Host "✅ Meal created successfully!" -ForegroundColor Green
    Write-Host "`nMeal Details:" -ForegroundColor Yellow
    Write-Host "ID: $($response.meal.id)"
    Write-Host "Name: $($response.meal.name)"
    Write-Host "Type: $($response.meal.meal_type)"
    Write-Host "Date: $($response.meal.meal_date)"
    Write-Host "`nFoods in meal:" -ForegroundColor Yellow
    $response.meal.foods | Format-Table name, category, servings, quantity_g
    Write-Host "Nutrition Totals:" -ForegroundColor Yellow
    Write-Host "Protein: $($response.totals.total_protein)g"
    Write-Host "Fat: $($response.totals.total_fat)g"
    Write-Host "Carbs: $($response.totals.total_carbs)g"
    Write-Host "Calories: $($response.totals.total_calories)"
} catch {
    Write-Host "❌ Create meal failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Step 3: Try creating meal template ===" -ForegroundColor Cyan
$templateData = @{
    name = "My Protein Smoothie Recipe"
    is_template = $true
    foods = @(
        @{
            food_id = 1
            servings = 2
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $token" } `
        -ContentType "application/json" `
        -Body $templateData
    
    Write-Host "✅ Template created!" -ForegroundColor Green
    Write-Host "Template name: $($response.meal.name)"
    Write-Host "Is template: $($response.meal.is_template)"
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Step 4: Test validation - empty foods array ===" -ForegroundColor Cyan
try {
    $invalidData = '{"name":"Empty Meal","foods":[]}'
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $token" } `
        -ContentType "application/json" `
        -Body $invalidData
    
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

Write-Host "`n=== Step 5: Test validation - invalid food ID ===" -ForegroundColor Cyan
try {
    $invalidData = '{"name":"Invalid Meal","foods":[{"food_id":99999,"servings":1}]}'
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals" `
        -Method POST `
        -Headers @{ Authorization = "Bearer $token" } `
        -ContentType "application/json" `
        -Body $invalidData
    
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected: $($_.ErrorDetails.Message)" -ForegroundColor Green
}
