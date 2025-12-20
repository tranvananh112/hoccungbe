# Verify Candy Crush Fix Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🍬 CANDY CRUSH FIX VERIFICATION" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if file exists
if (Test-Path "candy-crush-complete.js") {
    Write-Host "✅ File exists: candy-crush-complete.js" -ForegroundColor Green
    
    # Get file info
    $file = Get-Item "candy-crush-complete.js"
    Write-Host "📊 File size: $($file.Length) bytes" -ForegroundColor Yellow
    Write-Host "🕐 Last modified: $($file.LastWriteTime)" -ForegroundColor Yellow
    Write-Host ""
    
    # Check for syntax errors (basic check)
    Write-Host "🔍 Checking for common syntax errors..." -ForegroundColor Cyan
    
    $content = Get-Content "candy-crush-complete.js" -Raw
    
    # Check for duplicate code patterns
    if ($content -match "playVictorySound.*playVictorySound") {
        Write-Host "❌ WARNING: Duplicate playVictorySound found!" -ForegroundColor Red
    } else {
        Write-Host "✅ No duplicate playVictorySound" -ForegroundColor Green
    }
    
    if ($content -match "ANIMATION SYSTEM.*ANIMATION SYSTEM") {
        Write-Host "❌ WARNING: Duplicate ANIMATION SYSTEM comment found!" -ForegroundColor Red
    } else {
        Write-Host "✅ No duplicate ANIMATION SYSTEM" -ForegroundColor Green
    }
    
    # Check for proper IIFE closure
    if ($content -match "\}\)\(\);?\s*$") {
        Write-Host "✅ IIFE closure looks correct" -ForegroundColor Green
    } else {
        Write-Host "❌ WARNING: IIFE closure might be incorrect!" -ForegroundColor Red
    }
    
    # Check for class exports
    if ($content -match "window\.CandyCrushComplete\s*=\s*CandyCrushComplete") {
        Write-Host "✅ CandyCrushComplete export found" -ForegroundColor Green
    } else {
        Write-Host "❌ WARNING: CandyCrushComplete export not found!" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "📝 RECOMMENDATIONS:" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "1. Open test-candy-fresh.html in browser" -ForegroundColor Yellow
    Write-Host "2. Press Ctrl+Shift+R for hard refresh" -ForegroundColor Yellow
    Write-Host "3. Check console for any errors" -ForegroundColor Yellow
    Write-Host "4. If still errors, clear browser cache completely" -ForegroundColor Yellow
    Write-Host ""
    
    # Open test file
    $openFile = Read-Host "Open test-candy-fresh.html now? (y/n)"
    if ($openFile -eq "y") {
        Start-Process "test-candy-fresh.html"
        Write-Host "✅ Opening test file..." -ForegroundColor Green
    }
    
} else {
    Write-Host "❌ ERROR: candy-crush-complete.js not found!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
