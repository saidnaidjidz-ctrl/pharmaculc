 @echo off
echo ============================================
echo PharmCalc - Firebase Deployment
echo ============================================
echo.

cd /d "c:\Users\saidn\AppData\Local\Programs\Microsoft VS Code\bin\Nouveau dossier\pharmacalc"

echo هل سجلت دخولك بالفعل؟
echo If you haven't logged in yet, firebase will open your browser.
echo.
pause

echo Deploying to Firebase...
firebase deploy

echo.
echo ============================================
echo Deployment Complete!
echo Check your Firebase Console for the URL
echo ============================================
pause
