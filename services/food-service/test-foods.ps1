# Test Food Endpoint with different scenarios

Write-Host "=== Test 1: Get All Foods (Default - Page 1, 20 items) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods" -Method GET
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Total foods: $($response.total)" -ForegroundColor Yellow
    Write-Host "Page: $($response.page)" -ForegroundColor Yellow
    Write-Host "Page size: $($response.pageSize)" -ForegroundColor Yellow
    Write-Host "Total pages: $($response.totalPages)" -ForegroundColor Yellow
    Write-Host "Foods returned: $($response.foods.Count)" -ForegroundColor Yellow
    Write-Host "First 3 foods:"
    $response.foods | Select-Object -First 3 | Format-Table name, category, calories_per_100g
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 2: Filter by Category (Protein) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods?category=Protein" -Method GET
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Total protein foods: $($response.total)" -ForegroundColor Yellow
    Write-Host "First 5 protein foods:"
    $response.foods | Select-Object -First 5 | Format-Table name, category, protein_per_100g
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 3: Search by Name (chicken) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods?search=chicken" -Method GET
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Foods with 'chicken' in name: $($response.total)" -ForegroundColor Yellow
    $response.foods | Format-Table name, category, calories_per_100g
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 4: Pagination (Page 2, 5 items per page) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods?page=2&pageSize=5" -Method GET
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Page 2 foods (5 per page):" -ForegroundColor Yellow
    $response.foods | Format-Table name, category
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 5: Combine Filters (Protein + search 'egg') ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods?category=Protein&search=egg" -Method GET
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host "Protein foods with 'egg' in name: $($response.total)" -ForegroundColor Yellow
    $response.foods | Format-Table name, category, protein_per_100g
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
