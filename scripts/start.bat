@echo off
cd /d "%~dp0\.."

echo ==============================================
echo 🚀 OmniRoute Sentinel Startup (Hackathon Edition)
echo ==============================================

echo.
echo [1/2] 📦 Installing dependencies...
call npm install

echo.
echo [2/2] 🔌 Starting the Socket Server, Admin Dashboard, and Driver App...
call npm run dev

echo.
echo ✅ Servers have been shut down.
pause