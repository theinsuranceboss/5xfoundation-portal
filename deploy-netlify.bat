@echo off
set GIT_INDEX_FILE=.git/index_temp
echo ===================================================
echo   Deploying 5xFoundation Portal Updates to Netlify
echo ===================================================
echo.
echo Staging updated components...
git add .
echo.
echo Committing updates...
git commit -m "fix: next.config.ts distDir configuration for Netlify deployment and ignore generated files"
echo.
echo Pushing changes to GitHub to trigger Netlify auto-build...
git push origin main
echo.
echo ===================================================
echo   Done! Netlify will automatically build and deploy.
echo   If GitHub requests credentials, please log in.
echo ===================================================
pause
