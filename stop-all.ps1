# Script para detener todos los servicios Node.js

Write-Host "Deteniendo todos los servicios Node.js..." -ForegroundColor Yellow

# Obtener y detener todos los procesos de Node
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "✓ Todos los servicios Node.js han sido detenidos" -ForegroundColor Green
} else {
    Write-Host "No se encontraron servicios Node.js ejecutándose" -ForegroundColor Gray
}

# Esperar un momento
Start-Sleep -Seconds 1

Write-Host "`nPresiona Enter para cerrar..." -ForegroundColor Gray
Read-Host
