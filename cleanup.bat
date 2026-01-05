@echo off
echo 🧹 Dọn dẹp project...

REM Xóa file test
echo Xóa test files...
del /q test-*.html 2>nul
del /q demo-*.html 2>nul
del /q check-*.html 2>nul

REM Xóa docs không cần thiết
echo Xóa docs files...
del /q CANDY-*.md 2>nul
del /q FIX-*.md 2>nul
del /q DEBUG-*.md 2>nul
del /q HUONG-DAN-*.md 2>nul
del /q TOM-TAT-*.md 2>nul
del /q BAO-CAO-*.md 2>nul
del /q BUOC-*.md 2>nul
del /q CAI-TIEN-*.md 2>nul
del /q CLEAR-*.md 2>nul
del /q DEPLOY-*.md 2>nul
del /q GIAI-PHAP-*.md 2>nul
del /q KE-HOACH-*.md 2>nul
del /q KHOI-PHUC-*.md 2>nul
del /q KIEM-TRA-*.md 2>nul
del /q MOBILE-*.md 2>nul
del /q PHASE-*.md 2>nul
del /q QUICK-*.md 2>nul
del /q SNOW-*.md 2>nul
del /q SOLUTION-*.md 2>nul
del /q SUA-*.md 2>nul
del /q TAT-*.md 2>nul
del /q TEST-*.md 2>nul
del /q TRIEN-KHAI-*.md 2>nul
del /q TRUOC-*.md 2>nul
del /q VERIFY-*.md 2>nul
del /q VOICE-*.md 2>nul

REM Xóa file backup
echo Xóa backup files...
del /q *.backup.js 2>nul
del /q COMMIT-MESSAGE*.txt 2>nul
del /q clear-cache-instructions.md 2>nul
del /q fix-*.ps1 2>nul
del /q verify-*.ps1 2>nul
del /q git-commit-*.ps1 2>nul
del /q git-push-quick.* 2>nul

REM Xóa file JS không dùng
echo Xóa unused JS files...
del /q candy-crush-*.js 2>nul
del /q candy-audio-*.js 2>nul
del /q candy-device-*.js 2>nul
del /q candy-performance-*.js 2>nul
del /q candy-swipe-*.js 2>nul
del /q candy-ultra-*.js 2>nul
del /q debug-*.js 2>nul
del /q disable-*.js 2>nul
del /q mobile-audio-*.js 2>nul
del /q mobile-ios-*.js 2>nul
del /q mobile-optimizer.js 2>nul
del /q mobile-scroll-*.js 2>nul
del /q pwa-audio-*.js 2>nul
del /q snow-*.js 2>nul
del /q sync-manager.js 2>nul
del /q tracking-helper.js 2>nul
del /q voice-synthesizer.js 2>nul
del /q word-data-mega.js 2>nul

REM Xóa file CSS không dùng
echo Xóa unused CSS files...
del /q candy-crush-*.css 2>nul
del /q disable-*.css 2>nul
del /q layout-*.css 2>nul
del /q minimal-*.css 2>nul
del /q mobile-animation-*.css 2>nul
del /q mobile-ios-*.css 2>nul
del /q mobile-scroll-*.css 2>nul
del /q overflow-*.css 2>nul
del /q responsive-*.css 2>nul
del /q snow-*.css 2>nul
del /q transition-*.css 2>nul

REM Xóa file HTML không dùng
echo Xóa unused HTML files...
del /q candy-crush-*.html 2>nul
del /q difficulty-*.html 2>nul

REM Xóa file khác
echo Xóa misc files...
del /q code 2>nul
del /q "how*" 2>nul

echo ✅ Dọn dẹp hoàn tất!
pause