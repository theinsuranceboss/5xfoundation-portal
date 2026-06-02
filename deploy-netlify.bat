@echo off
echo ===================================================
echo   Deploying 5xFoundation Portal Updates to Netlify
echo ===================================================
echo.
echo Staging updated components...
git add .
echo.
echo Committing visual image editor and theme settings...
git commit -m "feat: visual image reordering, duplication controls, dynamic box shadows, and sticky header/footer dialog layout updates"
echo.
echo Pushing changes to GitHub to trigger Netlify auto-build...
git push origin main
echo.
echo ===================================================
echo   Done! Netlify will automatically build and deploy.
echo   If GitHub requests credentials, please log in.
echo ===================================================
pause
