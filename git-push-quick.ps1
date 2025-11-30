# ========================================
# GIT PUSH QUICK - Push nhanh không hỏi gì
# ========================================

Write-Host "⚡ PUSH NHANH..." -ForegroundColor Cyan

# Add all
git add .

# Commit với timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto update - $timestamp"

# Push
git push

Write-Host "✅ XONG!" -ForegroundColor Green
