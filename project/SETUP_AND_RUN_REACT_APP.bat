@echo off
echo ===================================================
echo   Treat Street React Portal - Setup and Runner
echo ===================================================
echo.
cd /d "%~dp0"

echo [1/3] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this machine!
    echo Please install Node.js (LTS version) from https://nodejs.org
    echo Once installed, double-click this file again.
    echo.
    pause
    exit /b 1
)

echo Node.js found:
node -v
npm -v
echo.

echo [2/3] Checking node dependencies...
if not exist "node_modules\" (
    echo Installing dependencies (this may take 1-2 minutes)...
    call npm install
) else (
    echo Dependencies are already installed.
)
echo.

echo [3/3] Starting Treat Street React App...
echo Press Ctrl+C in this window anytime to stop the server.
echo.
call npm run dev
pause
