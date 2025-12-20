@echo off
echo ================================
echo 🍬 CANDY CRUSH - QUICK GIT PUSH
echo ================================
echo.

echo 📝 Adding all files...
git add .

echo.
echo ✅ Files added!
echo.

echo 💬 Creating commit...
git commit -F COMMIT-MESSAGE.txt

echo.
echo ✅ Commit created!
echo.

echo 🚀 Pushing to remote...
git push

echo.
echo ✅ Done! All files pushed to Git!
echo.
pause
