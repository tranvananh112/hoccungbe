# Fix Git Files Script
# Kiểm tra và sửa các file bị lỗi

Write-Host "🔍 Checking for problematic files..." -ForegroundColor Cyan

# Kiểm tra encoding của các file
$files = @("auth.js", "supabase-config.js")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file exists" -ForegroundColor Green
        
        # Đọc nội dung
        $content = Get-Content $file -Raw
        
        # Kiểm tra conflict markers
        if ($content -match '<<<<<<<|>>>>>>>|=======') {
            Write-Host "❌ Found conflict markers in $file" -ForegroundColor Red
        } else {
            Write-Host "✅ No conflict markers in $file" -ForegroundColor Green
        }
        
        # Kiểm tra BOM
        $bytes = [System.IO.File]::ReadAllBytes($file)
        if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
            Write-Host "⚠️  $file has UTF-8 BOM" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ $file not found" -ForegroundColor Red
    }
}

Write-Host "`n📝 Recommendations:" -ForegroundColor Cyan
Write-Host "1. Clear browser cache (Ctrl + Shift + Delete)" -ForegroundColor White
Write-Host "2. Hard reload page (Ctrl + Shift + R)" -ForegroundColor White
Write-Host "3. Check files on GitHub web interface" -ForegroundColor White
Write-Host "4. If needed, force push: git push -f origin main" -ForegroundColor White

Write-Host "`n✅ Check complete!" -ForegroundColor Green
