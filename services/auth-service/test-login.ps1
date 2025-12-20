# Test Login Endpoint
# First, let's register a test user (if not already exists)

Write-Host "=== Testing Register Endpoint ===" -ForegroundColor Cyan

$registerBody = @{
    username = "testuser"
    email = "test@example.com"
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host ($registerResponse | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "⚠️  Registration response: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n=== Testing Login Endpoint ===" -ForegroundColor Cyan

$loginBody = @{
    email = "test@example.com"
    password = "Test123!@#"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token)" -ForegroundColor Yellow
    Write-Host "User:" -ForegroundColor Yellow
    Write-Host ($loginResponse.user | ConvertTo-Json -Depth 10)
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}
