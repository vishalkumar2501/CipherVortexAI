# CipherVortexAI - PowerShell Service Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "       Starting CipherVortexAI Microservices       " -ForegroundColor Magenta
Write-Host "===================================================" -ForegroundColor Cyan

$root = Resolve-Path "$PSScriptRoot\.."

Write-Host "[1/6] Launching Redis container..." -ForegroundColor Yellow
Set-Location "$root\backend"
docker-compose up -d

Start-Sleep -Seconds 2

Write-Host "[2/6] Launching Auth Service (8001)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d `"$root\backend\services\auth`" && npm run dev" -WindowStyle Normal

Write-Host "[3/6] Launching Chat Service (8002)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d `"$root\backend\services\chat`" && npm run dev" -WindowStyle Normal

Write-Host "[4/6] Launching Agent Service (8003)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d `"$root\backend\services\agent`" && npm run dev" -WindowStyle Normal

Write-Host "[5/6] Launching Billing Service (8004)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d `"$root\backend\services\billing`" && npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "[6/6] Launching API Gateway (8000)..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k cd /d `"$root\backend\gateway`" && npm run dev" -WindowStyle Normal

Write-Host "Launching Frontend (5173)..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k cd /d `"$root\frontend`" && npm run dev" -WindowStyle Normal

Write-Host "All CipherVortexAI services are starting!" -ForegroundColor Green
Write-Host "Web Interface: http://localhost:5173" -ForegroundColor Cyan
