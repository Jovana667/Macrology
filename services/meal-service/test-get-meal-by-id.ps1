# Test script for GET /api/meals/:id endpoint
# Replace with your actual values

# Configuration
$BASE_URL = "http://localhost:3003"
$MEAL_ID = 1  # Replace with an actual meal ID

# Step 1: Login to get token (replace with your credentials)
Write-Host "Step 1: Logging in..." -ForegroundColor Cyan
$loginBody = @{
    email = "test@example.com"  # Replace with your email
    password = "password123"      # Replace with your password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod `
        -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "Token: $token`n" -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Get meal by ID
Write-Host "Step 2: Fetching meal details for meal ID: $MEAL_ID..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod `
        -Uri "$BASE_URL/api/meals/$MEAL_ID" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✓ Successfully retrieved meal details`n" -ForegroundColor Green
    
    # Display meal information
    Write-Host "=== MEAL DETAILS ===" -ForegroundColor Yellow
    Write-Host "ID: $($response.id)"
    Write-Host "Name: $($response.name)"
    Write-Host "Type: $($response.meal_type)"
    Write-Host "Date: $($response.meal_date)"
    Write-Host "Is Template: $($response.is_template)"
    
    Write-Host "`n=== FOODS IN MEAL ===" -ForegroundColor Yellow
    foreach ($food in $response.foods) {
        Write-Host "`nFood: $($food.name) ($($food.category))" -ForegroundColor Cyan
        Write-Host "  Servings: $($food.servings)"
        Write-Host "  Quantity: $($food.quantity_g)g"
        Write-Host "  Per 100g - P: $($food.protein_per_100g)g | F: $($food.fat_per_100g)g | C: $($food.carbs_per_100g)g | Cal: $($food.calories_per_100g)"
        Write-Host "  Actual   - P: $($food.actual_protein)g | F: $($food.actual_fat)g | C: $($food.actual_carbs)g | Cal: $($food.actual_calories)" -ForegroundColor Green
    }
    
    Write-Host "`n=== TOTAL MACROS ===" -ForegroundColor Yellow
    Write-Host "Protein: $($response.totals.total_protein)g" -ForegroundColor Magenta
    Write-Host "Fat: $($response.totals.total_fat)g" -ForegroundColor Magenta
    Write-Host "Carbs: $($response.totals.total_carbs)g" -ForegroundColor Magenta
    Write-Host "Calories: $($response.totals.total_calories)" -ForegroundColor Magenta
    
    Write-Host "`n=== FULL RESPONSE JSON ===" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "✗ Request failed with status code: $statusCode" -ForegroundColor Red
    
    if ($statusCode -eq 404) {
        Write-Host "Meal not found or you don't have access to it" -ForegroundColor Yellow
    } elseif ($statusCode -eq 401) {
        Write-Host "Authentication failed - token may be invalid" -ForegroundColor Yellow
    } else {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}
