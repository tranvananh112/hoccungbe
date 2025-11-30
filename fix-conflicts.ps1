# Script to fix all merge conflicts - keep HEAD version
$files = Get-ChildItem -Filter "*.js" | Where-Object { 
    (Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue) -match "<<<<<<< HEAD" 
}

foreach ($file in $files) {
    Write-Host "Fixing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    
    # Remove conflict markers and keep only HEAD version
    # Pattern: <<<<<<< HEAD\n(content)\n=======\n(other content)\n>>>>>>> hash
    $fixed = $content -replace '(?s)<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>> [a-f0-9]+\r?\n', '$1'
    
    # Write back
    Set-Content -Path $file.FullName -Value $fixed -NoNewline
    
    Write-Host "  ✓ Fixed!" -ForegroundColor Green
}

Write-Host "`n✅ All conflicts resolved!" -ForegroundColor Green
