@echo off
REM MGNREGA Dashboard Deployment Script for Windows
REM This script sets up and deploys the MGNREGA Dashboard on Windows

echo Starting MGNREGA Dashboard Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo Setting up environment...

REM Create environment file from example if it doesn't exist
if not exist "server\.env" (
    echo Creating environment file...
    copy "server\.env.example" "server\.env"
    echo WARNING: Please update server\.env with your configuration before proceeding
    echo Press any key to continue after updating the environment file...
    pause >nul
)

REM Create necessary directories
echo Creating necessary directories...
if not exist "server\logs" mkdir "server\logs"
if not exist "nginx\ssl" mkdir "nginx\ssl"
if not exist "data\mongodb" mkdir "data\mongodb"
if not exist "data\redis" mkdir "data\redis"

echo Building and starting services...

REM Build and start containers
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be ready
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo Performing health checks...

REM Check if application is ready
curl -f http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo SUCCESS: Application is running
) else (
    echo ERROR: Application failed to start
    pause
    exit /b 1
)

echo.
echo ========================================
echo   MGNREGA Dashboard deployed successfully!
echo ========================================
echo.
echo Application URL: http://localhost:5000
echo Health Check: http://localhost:5000/health
echo MongoDB: localhost:27017
echo Redis: localhost:6379
echo.
echo Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop services: docker-compose down
echo   Restart services: docker-compose restart
echo   View status: docker-compose ps
echo.

REM Show container status
echo Container status:
docker-compose ps

echo.
echo Deployment completed!
pause