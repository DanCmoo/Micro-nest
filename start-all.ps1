# Script para iniciar todos los microservicios

Write-Host "Iniciando todos los microservicios..." -ForegroundColor Green

$rootPath = $PSScriptRoot

# Iniciar Product Service
Write-Host "`nIniciando Product Service en puerto 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\product-service'; npm run start:dev"

Start-Sleep -Seconds 2

# Iniciar Cart Service
Write-Host "Iniciando Cart Service en puerto 3001..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\cart-service'; npm run start:dev"

Start-Sleep -Seconds 2

# Iniciar API Gateway
Write-Host "Iniciando API Gateway en puerto 4000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\api-gateway'; npm run start:dev"

Start-Sleep -Seconds 2

# Iniciar Frontend
Write-Host "Iniciando Frontend en puerto 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootPath\frontend'; npm run dev"

Write-Host "`nTodos los servicios estan iniciandose" -ForegroundColor Green
Write-Host "`nServicios:" -ForegroundColor Yellow
Write-Host "  - Product Service: http://localhost:3000" -ForegroundColor White
Write-Host "  - Cart Service: http://localhost:3001" -ForegroundColor White
Write-Host "  - API Gateway: http://localhost:4000" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "`nPresiona Ctrl+C para cerrar este mensaje" -ForegroundColor Gray

# Mantener la ventana abierta
Read-Host "Presiona Enter para cerrar esta ventana"
