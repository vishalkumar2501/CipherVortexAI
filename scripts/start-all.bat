@echo off
TITLE CipherVortexAI - All Services Launcher
echo ===================================================
echo        Starting CipherVortexAI Services
echo ===================================================

cd /d "%~dp0\.."

echo [1/6] Starting Redis via Docker Compose...
cd backend
docker-compose up -d
cd ..

timeout /t 2 /nobreak >nul

echo [2/6] Starting Auth Service (Port 8001)...
start "CipherVortex - Auth Service (8001)" cmd /k "cd /d %~dp0\..\backend\services\auth && npm run dev"

echo [3/6] Starting Chat Service (Port 8002)...
start "CipherVortex - Chat Service (8002)" cmd /k "cd /d %~dp0\..\backend\services\chat && npm run dev"

echo [4/6] Starting Agent Service (Port 8003)...
start "CipherVortex - Agent Service (8003)" cmd /k "cd /d %~dp0\..\backend\services\agent && npm run dev"

echo [5/6] Starting Billing Service (Port 8004)...
start "CipherVortex - Billing Service (8004)" cmd /k "cd /d %~dp0\..\backend\services\billing && npm run dev"

timeout /t 2 /nobreak >nul

echo [6/6] Starting API Gateway (Port 8000)...
start "CipherVortex - API Gateway (8000)" cmd /k "cd /d %~dp0\..\backend\gateway && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend (Port 5173)...
start "CipherVortex - Frontend (5173)" cmd /k "cd /d %~dp0\..\frontend && npm run dev"

echo ===================================================
echo  All services triggered! Check individual windows.
echo  Frontend will be live at: http://localhost:5173
echo ===================================================
pause
