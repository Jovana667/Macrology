# Test Get Food By ID Endpoint

Write-Host "=== Test 1: Get Valid Food (ID 1) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/1" -Method GET
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Food details:" -ForegroundColor Yellow
    Write-Host "ID: $($response.id)"
    Write-Host "Name: $($response.name)"
    Write-Host "Category: $($response.category)"
    Write-Host "Protein: $($response.protein_per_100g)g per 100g"
    Write-Host "Carbs: $($response.carbs_per_100g)g per 100g"
    Write-Host "Fat: $($response.fat_per_100g)g per 100g"
    Write-Host "Calories: $($response.calories_per_100g) per 100g"
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 2: Get Another Valid Food (ID 5) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/5" -Method GET
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Name: $($response.name), Category: $($response.category)"
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 3: Invalid ID (Not a Number) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/abc" -Method GET
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly returned error: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

Write-Host "`n=== Test 4: Non-existent Food (ID 999999) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/999999" -Method GET
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly returned 404: $($_.ErrorDetails.Message)" -ForegroundColor Green
}

Write-Host "`n=== Test 5: Negative ID ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/-5" -Method GET
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly returned error: $($_.ErrorDetails.Message)" -ForegroundColor Green
}
