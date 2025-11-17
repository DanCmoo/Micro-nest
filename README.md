# 🛒 Microservices Store - Sistema Completo

Proyecto de microservicios usando NestJS, React, API Gateway, Docker y Docker Compose.

## 📁 Estructura del Proyecto

```
Micro-nest/
├── product-service/      # Microservicio de productos (NestJS)
├── cart-service/         # Microservicio de carrito (NestJS)
├── api-gateway/          # API Gateway (NestJS)
├── frontend/             # Frontend React + Vite
├── docker-compose.yml    # Orquestación completa
└── README.md
```

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │  Puerto 80 (React + Nginx)
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

- **Product Service** (Puerto 3000): Gestión de productos (CRUD + stock)
- **Cart Service** (Puerto 3001): Gestión de carritos de compra
- **API Gateway** (Puerto 4000): Punto de entrada único para el frontend
- **Frontend** (Puerto 80): Interfaz de usuario React

## 📋 Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** 8+
- **Docker** 20.10+ ([Descargar](https://docs.docker.com/get-docker/))
- **Docker Compose** 2.0+

Verificar instalación:
```powershell
node --version
npm --version
docker --version
docker-compose --version
```

## 🚀 Opción 1: Ejecutar con Docker Compose (RECOMENDADO)

### Paso 1: Construir y levantar todos los servicios

```powershell
# En la raíz del proyecto (Micro-nest/)
docker-compose up --build
```

Este comando:
- ✅ Construye las imágenes Docker de los 4 servicios
- ✅ Levanta todos los contenedores en el orden correcto
- ✅ Configura la red entre servicios
- ✅ Muestra los logs en tiempo real

### Paso 2: Acceder a la aplicación

**Frontend:** Abrir navegador en http://localhost

**API Gateway:** http://localhost:4000

**Product Service directo:** http://localhost:3000

**Cart Service directo:** http://localhost:3001

### Detener todos los servicios

```powershell
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Detener, eliminar volúmenes e imágenes
docker-compose down -v --rmi all
```

### Ver logs

```powershell
# Todos los servicios
docker-compose logs -f

# Un servicio específico
docker-compose logs -f product-service
docker-compose logs -f cart-service
docker-compose logs -f api-gateway
docker-compose logs -f frontend
```

### Ver estado de servicios

```powershell
docker-compose ps
```

---

## 🔧 Opción 2: Desarrollo Local (Sin Docker)

### Paso 1: Instalar dependencias en cada servicio

```powershell
# Terminal 1 - Product Service
cd product-service
npm install

# Terminal 2 - Cart Service
cd cart-service
npm install

# Terminal 3 - API Gateway
cd api-gateway
npm install

# Terminal 4 - Frontend
cd frontend
npm install
```

### Paso 2: Iniciar servicios en orden

**IMPORTANTE:** Iniciar en este orden para que las dependencias funcionen:

```powershell
# Terminal 1 - Product Service (PRIMERO)
cd product-service
npm run start:dev

# Terminal 2 - Cart Service (SEGUNDO)
cd cart-service
npm run start:dev

# Terminal 3 - API Gateway (TERCERO)
cd api-gateway
npm run start:dev

# Terminal 4 - Frontend (ÚLTIMO)
cd frontend
npm run dev
```

### Paso 3: Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:4000
- **Product Service:** http://localhost:3000
- **Cart Service:** http://localhost:3001

---

## 🧪 Probar la Aplicación

### Desde el Frontend (http://localhost o http://localhost:5173)

1. **Ver productos**: Se muestran automáticamente en la página principal
2. **Agregar al carrito**: Click en "Add to Cart" en cualquier producto
3. **Ver carrito**: Aparece en el panel derecho
4. **Eliminar items**: Click en "Remove" en cada item
5. **Limpiar carrito**: Click en "Clear Cart"

### Con curl (Probar API Gateway)

```powershell
# Listar productos
curl http://localhost:4000/api/products

# Obtener un producto
curl http://localhost:4000/api/products/1

# Agregar al carrito
curl -X POST http://localhost:4000/api/cart/add `
  -H "Content-Type: application/json" `
  -d '{\"userId\": \"user123\", \"productId\": 1, \"quantity\": 2}'

# Ver carrito
curl http://localhost:4000/api/cart/user123
```

---

## 📡 Endpoints Disponibles

### API Gateway (http://localhost:4000/api)

**Products:**
- `GET /api/products` - Listar todos los productos
- `GET /api/products/:id` - Obtener producto específico
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `POST /api/products/:id/decrement-stock` - Decrementar stock

**Cart:**
- `POST /api/cart/add` - Agregar item al carrito
- `GET /api/cart/:userId` - Ver carrito de usuario
- `GET /api/cart` - Ver todos los carritos
- `DELETE /api/cart/:userId` - Limpiar carrito
- `DELETE /api/cart/:userId/item/:itemId` - Eliminar item del carrito

---

## 🐛 Troubleshooting

### Error: Puerto ya en uso

```powershell
# Windows - Encontrar proceso usando puerto
netstat -ano | findstr :3000
netstat -ano | findstr :4000

# Matar proceso por PID
taskkill /PID <PID> /F
```

### Error: Docker no puede conectar servicios

```powershell
# Reiniciar red de Docker
docker-compose down
docker network prune
docker-compose up --build
```

### Error: Frontend no puede conectar con Gateway

Verificar que en `frontend/src/services/api.js` la URL sea correcta:
- **Desarrollo local**: `http://localhost:4000/api`
- **Docker**: Usar la IP del host o configurar variables de entorno

### Limpiar Docker completamente

```powershell
# Detener todos los contenedores
docker-compose down -v

# Eliminar imágenes, contenedores y volúmenes
docker system prune -a --volumes

# Reconstruir desde cero
docker-compose up --build
```

---

## 📝 Datos de Prueba

La aplicación viene con productos pre-cargados:

1. **Laptop Gaming** - $1200.00 (Stock: 5)
2. **Wireless Mouse** - $35.99 (Stock: 50)
3. **Monitor 4K** - $450.00 (Stock: 10)

Usuario de prueba: `user123`

---

## 🛠️ Stack Tecnológico

- **Backend**: NestJS, TypeScript, Axios
- **Frontend**: React, Vite, Axios
- **Validación**: class-validator, class-transformer
- **Contenedores**: Docker, Docker Compose
- **Web Server**: Nginx (para frontend en producción)

---

## 📄 Licencia

Este proyecto es para fines educativos.
