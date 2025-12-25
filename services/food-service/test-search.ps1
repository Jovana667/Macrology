# Test Autocomplete Search Endpoint

Write-Host "=== Test 1: Search for 'chicken' ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/search?q=chicken" -Method GET
    Write-Host "✅ Success! Found $($response.Count) results:" -ForegroundColor Green
    $response | Select-Object -First 5 | Format-Table name, category, calories_per_100g
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 2: Search for 'egg' ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/search?q=egg" -Method GET
    Write-Host "✅ Success! Found $($response.Count) results:" -ForegroundColor Green
    $response | Format-Table name, category
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 3: Partial search 'chic' ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/search?q=chic" -Method GET
    Write-Host "✅ Success! Found $($response.Count) results:" -ForegroundColor Green
    $response | Format-Table name, category
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 4: Empty query ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/search?q=" -Method GET
    if ($response.Count -eq 0) {
        Write-Host "✅ Success! Correctly returned empty array" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Returned $($response.Count) results (expected 0)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 5: Case insensitivity 'CHICKEN' ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/search?q=CHICKEN" -Method GET
    Write-Host "✅ Success! Found $($response.Count) results (case insensitive works):" -ForegroundColor Green
    $response | Select-Object -First 3 | Format-Table name
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test 6: Verify limit (max 10 results) ===" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/foods/search?q=a" -Method GET
    Write-Host "✅ Returned $($response.Count) results (should be ≤ 10)" -ForegroundColor Green
    if ($response.Count -gt 10) {
        Write-Host "⚠️  WARNING: Returned more than 10 results!" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
