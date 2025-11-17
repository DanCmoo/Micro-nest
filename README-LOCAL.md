# Ejecución Local del Proyecto de Microservicios

## Requisitos
- Node.js (v18 o superior)
- npm

## Instalación

Primero, instala las dependencias de cada servicio:

```powershell
# Product Service
cd product-service
npm install

# Cart Service
cd ../cart-service
npm install

# API Gateway
cd ../api-gateway
npm install

# Frontend
cd ../frontend
npm install
```

## Ejecución

### Opción 1: Script Automático (Recomendado)

Ejecuta el script `start-all.ps1` desde la raíz del proyecto:

```powershell
.\start-all.ps1
```

Este script abrirá 4 ventanas de PowerShell, una para cada servicio.

Para detener todos los servicios:

```powershell
.\stop-all.ps1
```

### Opción 2: Manual

Abre 4 terminales diferentes y ejecuta en cada una:

**Terminal 1 - Product Service:**
```powershell
cd product-service
npm run start:dev
```

**Terminal 2 - Cart Service:**
```powershell
cd cart-service
npm run start:dev
```

**Terminal 3 - API Gateway:**
```powershell
cd api-gateway
npm run start:dev
```

**Terminal 4 - Frontend:**
```powershell
cd frontend
npm run dev
```

## URLs de los Servicios

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:4000
- **Product Service**: http://localhost:3000
- **Cart Service**: http://localhost:3001

## Arquitectura

```
Frontend (React + Vite)
    ↓
API Gateway (NestJS)
    ↓
    ├── Product Service (NestJS)
    └── Cart Service (NestJS)
```

## Notas

- Los servicios se reinician automáticamente cuando detectan cambios en el código (modo watch)
- El frontend tiene Hot Module Replacement (HMR) activado
- Asegúrate de que los puertos 3000, 3001, 4000 y 5173 estén disponibles
