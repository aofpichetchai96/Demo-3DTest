@echo off
REM OEM 3D System Docker Setup Script for Windows

echo 🚀 Setting up OEM 3D Product Customization System with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    docker compose version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Docker Compose is not available. Please install Docker Compose.
        pause
        exit /b 1
    )
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "backend\uploads" mkdir "backend\uploads"
if not exist "backend\logs" mkdir "backend\logs"
if not exist "postgres_data" mkdir "postgres_data"
if not exist "redis_data" mkdir "redis_data"

REM Copy environment file
if not exist ".env" (
    echo 📝 Copying environment configuration...
    copy ".env.docker" ".env"
)

echo 🐳 Building and starting Docker containers...

REM Build and start services
docker-compose up -d --build

echo ⏳ Waiting for services to be ready...

REM Wait for services (simplified for Windows)
timeout /t 30 /nobreak

echo ✅ Services should be ready!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:3001
echo    API Health Check: http://localhost:3001/api/health
echo.
echo 🔧 Management Commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo    View status: docker-compose ps
echo.
echo 📊 Database Connection:
echo    Host: localhost
echo    Port: 5432
echo    Database: oem_3d_system
echo    Username: postgres
echo    Password: postgres123
echo.
echo 🎉 Setup complete! Your OEM 3D system should now be running.
echo    Please check the URLs above to verify everything is working.
echo.
pause
