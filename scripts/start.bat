@echo off

echo ===============================
echo   OmniRoute Sentinel Startup
echo ===============================

echo.
echo Installing dependencies...
call npm install

echo.
echo Starting development server...
call npm run dev

echo.
echo Server is running!
pause