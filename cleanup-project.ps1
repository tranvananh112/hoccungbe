# Script dọn dẹp project
Write-Host "🧹 Bắt đầu dọn dẹp project..." -ForegroundColor Green

# Di chuyển file CSS quan trọng
Write-Host "📁 Di chuyển CSS files..." -ForegroundColor Yellow
Copy-Item "styles.css" "assets/css/" -ErrorAction SilentlyContinue
Copy-Item "game-ultimate.css" "assets/css/" -ErrorAction SilentlyContinue
Copy-Item "components-ultimate.css" "assets/css/" -ErrorAction SilentlyContinue
Copy-Item "universal-design.css" "assets/css/" -ErrorAction SilentlyContinue
Copy-Item "mobile-enhanced.css" "assets/css/" -ErrorAction SilentlyContinue

# Di chuyển file JS quan trọng
Write-Host "📁 Di chuyển JS files..." -ForegroundColor Yellow
Copy-Item "main.js" "assets/js/" -ErrorAction SilentlyContinue
Copy-Item "animations.js" "assets/js/" -ErrorAction SilentlyContinue
Copy-Item "audio-manager.js" "assets/js/" -ErrorAction SilentlyContinue
Copy-Item "mobile-performance.js" "assets/js/" -ErrorAction SilentlyContinue
Copy-Item "auto-tracking.js" "assets/js/" -ErrorAction SilentlyContinue

# Di chuyển data files
Write-Host "📁 Di chuyển Data files..." -ForegroundColor Yellow
Copy-Item "sentence-data.js" "src/data/" -ErrorAction SilentlyContinue
Copy-Item "word-data-optimized.js" "src/data/" -ErrorAction SilentlyContinue
Copy-Item "word-themes.js" "src/data/" -ErrorAction SilentlyContinue
Copy-Item "shop-data.js" "src/data/" -ErrorAction SilentlyContinue
Copy-Item "difficulty-system.js" "src/data/" -ErrorAction SilentlyContinue

# Di chuyển auth files
Write-Host "📁 Di chuyển Auth files..." -ForegroundColor Yellow
Copy-Item "auth.html" "src/components/" -ErrorAction SilentlyContinue
Copy-Item "auth.js" "src/components/" -ErrorAction SilentlyContinue
Copy-Item "supabase-config.js" "src/components/" -ErrorAction SilentlyContinue

# Di chuyển scripts
Write-Host "📁 Di chuyển Scripts..." -ForegroundColor Yellow
Copy-Item "git-push.ps1" "scripts/" -ErrorAction SilentlyContinue
Copy-Item "server.js" "scripts/" -ErrorAction SilentlyContinue

# Xóa file test
Write-Host "🗑️ Xóa test files..." -ForegroundColor Red
Remove-Item "test-*.html" -ErrorAction SilentlyContinue
Remove-Item "demo-*.html" -ErrorAction SilentlyContinue
Remove-Item "check-*.html" -ErrorAction SilentlyContinue

# Xóa docs không cần thiết
Write-Host "🗑️ Xóa docs files..." -ForegroundColor Red
Remove-Item "CANDY-*.md" -ErrorAction SilentlyContinue
Remove-Item "FIX-*.md" -ErrorAction SilentlyContinue
Remove-Item "DEBUG-*.md" -ErrorAction SilentlyContinue
Remove-Item "HUONG-DAN-*.md" -ErrorAction SilentlyContinue
Remove-Item "TOM-TAT-*.md" -ErrorAction SilentlyContinue
Remove-Item "BAO-CAO-*.md" -ErrorAction SilentlyContinue
Remove-Item "BUOC-*.md" -ErrorAction SilentlyContinue
Remove-Item "CAI-TIEN-*.md" -ErrorAction SilentlyContinue
Remove-Item "CLEAR-*.md" -ErrorAction SilentlyContinue
Remove-Item "DEPLOY-*.md" -ErrorAction SilentlyContinue
Remove-Item "GIAI-PHAP-*.md" -ErrorAction SilentlyContinue
Remove-Item "KE-HOACH-*.md" -ErrorAction SilentlyContinue
Remove-Item "KHOI-PHUC-*.md" -ErrorAction SilentlyContinue
Remove-Item "KIEM-TRA-*.md" -ErrorAction SilentlyContinue
Remove-Item "MOBILE-*.md" -ErrorAction SilentlyContinue
Remove-Item "PHASE-*.md" -ErrorAction SilentlyContinue
Remove-Item "QUICK-*.md" -ErrorAction SilentlyContinue
Remove-Item "SNOW-*.md" -ErrorAction SilentlyContinue
Remove-Item "SOLUTION-*.md" -ErrorAction SilentlyContinue
Remove-Item "SUA-*.md" -ErrorAction SilentlyContinue
Remove-Item "TAT-*.md" -ErrorAction SilentlyContinue
Remove-Item "TEST-*.md" -ErrorAction SilentlyContinue
Remove-Item "TRIEN-KHAI-*.md" -ErrorAction SilentlyContinue
Remove-Item "TRUOC-*.md" -ErrorAction SilentlyContinue
Remove-Item "VERIFY-*.md" -ErrorAction SilentlyContinue
Remove-Item "VOICE-*.md" -ErrorAction SilentlyContinue

# Xóa file backup và temp
Write-Host "🗑️ Xóa backup files..." -ForegroundColor Red
Remove-Item "*.backup.js" -ErrorAction SilentlyContinue
Remove-Item "COMMIT-MESSAGE*.txt" -ErrorAction SilentlyContinue
Remove-Item "clear-cache-instructions.md" -ErrorAction SilentlyContinue
Remove-Item "fix-*.ps1" -ErrorAction SilentlyContinue
Remove-Item "verify-*.ps1" -ErrorAction SilentlyContinue
Remove-Item "git-commit-*.ps1" -ErrorAction SilentlyContinue
Remove-Item "git-push-quick.*" -ErrorAction SilentlyContinue

# Xóa file JS không dùng
Write-Host "🗑️ Xóa unused JS files..." -ForegroundColor Red
Remove-Item "candy-crush-*.js" -ErrorAction SilentlyContinue
Remove-Item "candy-audio-*.js" -ErrorAction SilentlyContinue
Remove-Item "candy-device-*.js" -ErrorAction SilentlyContinue
Remove-Item "candy-performance-*.js" -ErrorAction SilentlyContinue
Remove-Item "candy-swipe-*.js" -ErrorAction SilentlyContinue
Remove-Item "candy-ultra-*.js" -ErrorAction SilentlyContinue
Remove-Item "debug-*.js" -ErrorAction SilentlyContinue
Remove-Item "disable-*.js" -ErrorAction SilentlyContinue
Remove-Item "mobile-audio-*.js" -ErrorAction SilentlyContinue
Remove-Item "mobile-ios-*.js" -ErrorAction SilentlyContinue
Remove-Item "mobile-optimizer.js" -ErrorAction SilentlyContinue
Remove-Item "mobile-scroll-*.js" -ErrorAction SilentlyContinue
Remove-Item "pwa-audio-*.js" -ErrorAction SilentlyContinue
Remove-Item "snow-*.js" -ErrorAction SilentlyContinue
Remove-Item "sync-manager.js" -ErrorAction SilentlyContinue
Remove-Item "tracking-helper.js" -ErrorAction SilentlyContinue
Remove-Item "voice-synthesizer.js" -ErrorAction SilentlyContinue
Remove-Item "word-data-mega.js" -ErrorAction SilentlyContinue

# Xóa file CSS không dùng
Write-Host "🗑️ Xóa unused CSS files..." -ForegroundColor Red
Remove-Item "candy-crush-*.css" -ErrorAction SilentlyContinue
Remove-Item "disable-*.css" -ErrorAction SilentlyContinue
Remove-Item "layout-*.css" -ErrorAction SilentlyContinue
Remove-Item "minimal-*.css" -ErrorAction SilentlyContinue
Remove-Item "mobile-animation-*.css" -ErrorAction SilentlyContinue
Remove-Item "mobile-ios-*.css" -ErrorAction SilentlyContinue
Remove-Item "mobile-scroll-*.css" -ErrorAction SilentlyContinue
Remove-Item "overflow-*.css" -ErrorAction SilentlyContinue
Remove-Item "responsive-*.css" -ErrorAction SilentlyContinue
Remove-Item "snow-*.css" -ErrorAction SilentlyContinue
Remove-Item "transition-*.css" -ErrorAction SilentlyContinue

# Xóa file HTML không dùng
Write-Host "🗑️ Xóa unused HTML files..." -ForegroundColor Red
Remove-Item "candy-crush-*.html" -ErrorAction SilentlyContinue
Remove-Item "difficulty-*.html" -ErrorAction SilentlyContinue

# Xóa file khác
Write-Host "🗑️ Xóa misc files..." -ForegroundColor Red
Remove-Item "code" -ErrorAction SilentlyContinue
Remove-Item "how*" -ErrorAction SilentlyContinue

Write-Host "✅ Dọn dẹp hoàn tất!" -ForegroundColor Green
Write-Host "📊 Kiểm tra cấu trúc mới..." -ForegroundColor Cyan
Get-ChildItem -Directory | Format-Table Name