# 🛒 Microservices Store - Sistema de E-commerce con Microservicios

Proyecto de microservicios desarrollado con NestJS y React, implementando un sistema de productos y carrito de compras con arquitectura de API Gateway.

## 📁 Estructura del Proyecto

```
Micro-nest/
├── product-service/      # Microservicio de productos (NestJS)
├── cart-service/         # Microservicio de carrito (NestJS)
├── api-gateway/          # API Gateway (NestJS)
├── frontend/             # Frontend React + Vite
├── start-all.ps1         # Script para iniciar todos los servicios
├── stop-all.ps1          # Script para detener todos los servicios
└── README.md
```

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │  Puerto 5173 (React + Vite)
│   (React)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │  Puerto 4000 (NestJS)
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌─────────┐
│Product  │ │  Cart   │
│Service  │ │ Service │
│Port 3000│ │Port 3001│
└─────────┘ └─────────┘
```

## ⚙️ Servicios

- **Product Service** (Puerto 3000): Gestión de productos (CRUD + control de stock)
- **Cart Service** (Puerto 3001): Gestión de carritos de compra con validación de stock
- **API Gateway** (Puerto 4000): Punto de entrada único, proxy para todos los servicios
- **Frontend** (Puerto 5173): Interfaz de usuario con React y diseño moderno

## 📋 Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** 8+

Verificar instalación:
```powershell
node --version
npm --version
```

## 🚀 Inicio Rápido

### Paso 1: Clonar el repositorio

```powershell
git clone <URL_DEL_REPOSITORIO>
cd Micro-nest
```

### Paso 2: Instalar dependencias

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
cd ..
```

### Paso 3: Iniciar todos los servicios

**Opción A: Script Automático (Recomendado)**

```powershell
# Desde la raíz del proyecto
.\start-all.ps1
```

Este script:
- ✅ Abre 4 ventanas de PowerShell automáticamente
- ✅ Inicia cada servicio en su propia ventana
- ✅ Funciona desde cualquier ubicación del proyecto (portable)

**Para detener todos los servicios:**

```powershell
.\stop-all.ps1
```

**Opción B: Manualmente**

Abre 4 terminales y ejecuta en cada una:

```powershell
# Terminal 1 - Product Service
cd product-service
npm run start:dev

# Terminal 2 - Cart Service
cd cart-service
npm run start:dev

# Terminal 3 - API Gateway
cd api-gateway
npm run start:dev

# Terminal 4 - Frontend
cd frontend
npm run dev
```

### Paso 4: Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:4000
- **Product Service**: http://localhost:3000
- **Cart Service**: http://localhost:3001

---

## 🧪 Probar la Aplicación

### Desde el Frontend (http://localhost:5173)

1. **Ver productos**: Se cargan automáticamente 3 productos con stock
2. **Agregar al carrito**: Click en "Add to Cart" 
3. **Validación de stock**: No permite agregar más del stock disponible
4. **Ver carrito**: Panel derecho muestra items, cantidades y total
5. **Eliminar items**: Botón "Remove" en cada producto
6. **Limpiar carrito**: Botón "Clear Cart"

### Probar con curl

```powershell
# Listar productos
curl http://localhost:4000/api/products

# Obtener un producto específico
curl http://localhost:4000/api/products/1

# Agregar al carrito
curl -X POST http://localhost:4000/api/cart/add `
  -H "Content-Type: application/json" `
  -d '{\"userId\": \"user123\", \"productId\": 1, \"quantity\": 1}'

# Ver carrito del usuario
curl http://localhost:4000/api/cart/user123

# Eliminar item del carrito
curl -X DELETE http://localhost:4000/api/cart/user123/item/1

# Limpiar carrito completo
curl -X DELETE http://localhost:4000/api/cart/user123
```

---

## 📡 Endpoints API

### API Gateway (http://localhost:4000/api)

**Products:**
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `POST /api/products/:id/decrement-stock` - Decrementar stock

**Cart:**
- `POST /api/cart/add` - Agregar item al carrito
  ```json
  {
    "userId": "user123",
    "productId": 1,
    "quantity": 2
  }
  ```
- `GET /api/cart/:userId` - Obtener carrito de usuario
- `GET /api/cart` - Listar todos los carritos
- `DELETE /api/cart/:userId/item/:cartItemId` - Eliminar item específico
- `DELETE /api/cart/:userId` - Limpiar carrito del usuario

---

## 📝 Datos de Prueba

La aplicación incluye productos pre-cargados:

1. **Laptop Gaming** - $1,200.00 (Stock: 5)
   - Procesador de última generación
2. **Wireless Mouse** - $35.99 (Stock: 50)
   - Ergonómico y preciso
3. **Monitor 4K** - $450.00 (Stock: 10)
   - Resolución ultra HD

Usuario de prueba: `user123`

---

## ✨ Características Implementadas

- ✅ Arquitectura de microservicios con API Gateway
- ✅ Validación de stock en tiempo real
- ✅ Manejo de errores con mensajes descriptivos
- ✅ Interfaz moderna con gradientes y animaciones
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Hot reload en desarrollo (frontend y backend)
- ✅ Scripts automáticos de inicio/detención
- ✅ Comunicación entre microservicios vía HTTP
- ✅ Validación de DTOs con class-validator
- ✅ TypeScript en todo el stack backend

---

## 🛠️ Stack Tecnológico

**Backend:**
- NestJS 11.0.1
- TypeScript 5.7.3
- class-validator & class-transformer
- Axios para comunicación entre servicios

**Frontend:**
- React 18
- Vite 6
- Axios
- CSS3 con gradientes y animaciones

**Herramientas:**
- ESLint & Prettier
- Git

---

## 🐛 Solución de Problemas

### Error: Puerto ya en uso

```powershell
# Encontrar proceso usando el puerto
Get-NetTCPConnection -LocalPort 3000

# Detener todos los procesos Node
Get-Process node | Stop-Process -Force
```

### Los servicios no inician correctamente

1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que las dependencias estén instaladas en cada servicio
3. Asegúrate de que los puertos 3000, 3001, 4000, 5173 estén libres

### Error al agregar productos al carrito

- Verifica que el Product Service esté corriendo en puerto 3000
- Verifica que el API Gateway esté corriendo en puerto 4000
- Revisa la consola del navegador para ver errores de red

---

## 📚 Comandos Útiles

```powershell
# Verificar servicios corriendo
Get-NetTCPConnection -LocalPort 3000,3001,4000,5173

# Ver procesos Node activos
Get-Process node

# Detener todos los servicios Node
.\stop-all.ps1

# Iniciar en modo desarrollo (cada servicio)
npm run start:dev

# Build de producción (cada servicio)
npm run build

# Limpiar node_modules y reinstalar
Remove-Item node_modules -Recurse -Force
npm install
```

---

## 📄 Licencia

Este proyecto es para fines educativos y de demostración.
