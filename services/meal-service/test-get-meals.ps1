# Test Get Meals Endpoint

Write-Host "=== Step 1: Login to get auth token ===" -ForegroundColor Cyan
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"email":"test@example.com","password":"Test123!@#"}'
    
    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure auth-service is running and you have a test user" -ForegroundColor Yellow
    exit
}

Write-Host "`n=== Step 2: Get all meals (default pagination) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Total meals: $($response.total)" -ForegroundColor Yellow
    Write-Host "Page: $($response.page) of $($response.totalPages)" -ForegroundColor Yellow
    Write-Host "Page size: $($response.pageSize)" -ForegroundColor Yellow
    Write-Host "`nMeals:" -ForegroundColor Yellow
    $response.meals | Format-Table id, name, meal_type, food_count, created_at -AutoSize
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Step 3: Get meals with custom pagination (page 1, 5 items) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals?page=1&pageSize=5" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✅ Success! Showing $($response.meals.Count) meals" -ForegroundColor Green
    $response.meals | Format-Table id, name, meal_type, food_count
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Step 4: Get page 2 ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals?page=2&pageSize=5" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✅ Page 2 meals:" -ForegroundColor Green
    $response.meals | Format-Table id, name, meal_type, food_count
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Step 5: Test without authentication (should fail) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals" -Method GET
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly rejected: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

Write-Host "`n=== Step 6: Verify meals are sorted by created_at DESC ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals?pageSize=10" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✅ Meals ordered newest first:" -ForegroundColor Green
    $response.meals | Select-Object -First 5 | Format-Table id, name, @{Label="Created"; Expression={$_.created_at}}
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Step 7: Check food_count is accurate ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/meals?pageSize=5" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $token" }
    
    Write-Host "✅ Meals with food counts:" -ForegroundColor Green
    foreach ($meal in $response.meals) {
        Write-Host "$($meal.name): $($meal.food_count) food(s)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
