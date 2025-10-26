@echo off
echo.
echo ========================================
echo   MGNREGA Dashboard - Complete Setup   
echo ========================================
echo.

:: Check if we have Node.js
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js detected: 
node --version

echo.
echo This script will:
echo   1. Install dependencies for server and client
echo   2. Start the backend server (Port 5000)
echo   3. Start the React frontend (Port 3000)
echo.

set /p choice="Continue? (Y/N): "
if /i "%choice%" neq "Y" exit /b 0

echo.
echo ==========================================
echo   Step 1: Setting up Server Dependencies
echo ==========================================
cd /d "%~dp0server"

if not exist node_modules (
    echo Installing server dependencies...
    call npm install --silent
    if %errorlevel% neq 0 (
        echo ❌ Server dependency installation failed
        pause
        exit /b 1
    )
)
echo ✓ Server dependencies ready

echo.
echo ==========================================
echo   Step 2: Setting up Client Dependencies  
echo ==========================================
cd /d "%~dp0client"

if not exist node_modules (
    echo Installing client dependencies...
    call npm install --silent
    if %errorlevel% neq 0 (
        echo ❌ Client dependency installation failed
        pause
        exit /b 1
    )
)
echo ✓ Client dependencies ready

echo.
echo ==========================================
echo   Step 3: Starting Services
echo ==========================================

echo Starting backend server in a new window...
cd /d "%~dp0server"
start "MGNREGA Server" cmd /c "npm start & pause"

:: Wait a moment for server to start
timeout /t 3 /nobreak > nul

echo Starting frontend client in a new window...
cd /d "%~dp0client"  
start "MGNREGA Client" cmd /c "npm start & pause"

echo.
echo ✅ MGNREGA Dashboard is starting up!
echo.
echo 📊 Server: http://localhost:5000
echo 🌐 Client: http://localhost:3000
echo.
echo Both services are running in separate windows.
echo Close those windows to stop the services.
echo.
pause