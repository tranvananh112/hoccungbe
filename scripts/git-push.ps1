# ========================================
# GIT PUSH SCRIPT - Tự động push code lên GitHub
# ========================================

Write-Host "🚀 Bắt đầu push code lên GitHub..." -ForegroundColor Green
Write-Host ""

# Kiểm tra Git đã cài chưa
try {
    $gitVersion = git --version
    Write-Host "✅ Git đã cài: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng cài Git từ: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Kiểm tra xem đã init git chưa
if (-not (Test-Path ".git")) {
    Write-Host "📦 Khởi tạo Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Đã khởi tạo Git" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository đã tồn tại" -ForegroundColor Green
}

Write-Host ""

# Add tất cả files
Write-Host "📁 Đang add tất cả files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Đã add files" -ForegroundColor Green

Write-Host ""

# Commit với message
$commitMessage = Read-Host "💬 Nhập commit message (Enter để dùng mặc định)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update code - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host "📝 Đang commit với message: $commitMessage" -ForegroundColor Yellow
git commit -m "$commitMessage"
Write-Host "✅ Đã commit" -ForegroundColor Green

Write-Host ""

# Kiểm tra xem đã có remote chưa
$remotes = git remote
if ($remotes -notcontains "origin") {
    Write-Host "🔗 Chưa có remote repository" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Vui lòng làm theo các bước sau:" -ForegroundColor Cyan
    Write-Host "1. Tạo repository mới trên GitHub: https://github.com/new" -ForegroundColor White
    Write-Host "2. Copy URL của repository (ví dụ: https://github.com/username/repo-name.git)" -ForegroundColor White
    Write-Host ""
    
    $repoUrl = Read-Host "Nhập URL của GitHub repository"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ URL không hợp lệ!" -ForegroundColor Red
        exit
    }
    
    Write-Host "🔗 Đang thêm remote origin..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    Write-Host "✅ Đã thêm remote" -ForegroundColor Green
} else {
    Write-Host "✅ Remote origin đã tồn tại" -ForegroundColor Green
}

Write-Host ""

# Kiểm tra branch
$currentBranch = git branch --show-current
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    Write-Host "📌 Tạo branch main..." -ForegroundColor Yellow
    git branch -M main
    $currentBranch = "main"
}

Write-Host "📌 Branch hiện tại: $currentBranch" -ForegroundColor Cyan

Write-Host ""

# Push lên GitHub
Write-Host "🚀 Đang push lên GitHub..." -ForegroundColor Yellow
try {
    git push -u origin $currentBranch
    Write-Host ""
    Write-Host "✅ ĐÃ PUSH THÀNH CÔNG!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Code đã được tải lên GitHub!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "⚠️ Lỗi khi push. Có thể do:" -ForegroundColor Yellow
    Write-Host "1. Chưa đăng nhập GitHub" -ForegroundColor White
    Write-Host "2. Repository chưa tồn tại" -ForegroundColor White
    Write-Host "3. Không có quyền push" -ForegroundColor White
    Write-Host ""
    Write-Host "Thử lại với force push? (y/n)" -ForegroundColor Yellow
    $retry = Read-Host
    
    if ($retry -eq "y" -or $retry -eq "Y") {
        Write-Host "🚀 Đang force push..." -ForegroundColor Yellow
        git push -u origin $currentBranch --force
        Write-Host "✅ Đã force push!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Nhấn Enter để đóng..." -ForegroundColor Gray
Read-Host
