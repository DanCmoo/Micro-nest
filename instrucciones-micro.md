# Guía Completa: Crear 2 Microservicios con NestJS
## Para Agentes IA - Instrucciones Paso a Paso

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación y Setup Inicial](#instalación-y-setup-inicial)
3. [Crear Product Service](#crear-product-service)
4. [Crear Cart Service](#crear-cart-service)
5. [Comunicación Entre Servicios](#comunicación-entre-servicios)
6. [Dockerización](#dockerización)
7. [Orquestación con Docker Compose](#orquestación-con-docker-compose)
8. [Pruebas y Validación](#pruebas-y-validación)
9. [Troubleshooting](#troubleshooting)

---

## ✅ Requisitos Previos

### Software Necesario (DEBE estar instalado)

1. **Node.js** (v18.0.0 o superior)
   - Verificar: `node --version`
   - Si no está instalado: https://nodejs.org/

2. **npm** (v8.0.0 o superior, incluido con Node.js)
   - Verificar: `npm --version`

3. **Docker** (v20.10.0 o superior)
   - Verificar: `docker --version`
   - Si no está instalado: https://docs.docker.com/get-docker/

4. **Docker Compose** (v2.0.0 o superior)
   - Verificar: `docker-compose --version`
   - Si no está instalado: https://docs.docker.com/compose/install/

5. **Git** (recomendado)
   - Verificar: `git --version`

### Puertos Necesarios (DEBEN estar disponibles)

- Puerto 3000: Product Service
- Puerto 3001: Cart Service
- Puerto 5432: PostgreSQL (si se usa base de datos)

**Verificar puertos disponibles**:
```bash
# En Linux/Mac
lsof -i :3000
lsof -i :3001

# En Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

---

## 🚀 Instalación y Setup Inicial

### Paso 1: Instalar NestJS CLI Globalmente

```bash
npm install -g @nestjs/cli
```

**Verificar instalación**:
```bash
nest --version
```

Expected output: versión de NestJS (ej: 10.0.0)

### Paso 2: Crear Directorio de Trabajo

```bash
# Crear carpeta para el proyecto
mkdir microservices-workshop
cd microservices-workshop

# Crear carpeta para producto
mkdir product-service
mkdir cart-service
```

### Paso 3: Crear `.gitignore` (Opcional pero recomendado)

```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

---

## 🏗️ Crear Product Service

### Paso 1: Generar Proyecto NestJS

```bash
cd product-service
nest new . --package-manager npm --skip-git
# Responder "npm" cuando pregunte por package manager
cd ..
```

**Output esperado**: Carpeta `product-service` con estructura de NestJS

### Paso 2: Instalar Dependencias Adicionales

```bash
cd product-service

# Dependencias necesarias
npm install class-validator class-transformer
npm install @nestjs/common @nestjs/core @nestjs/platform-express

cd ..
```

### Paso 3: Crear Estructura de Carpetas

```bash
cd product-service

# Crear estructura modular
mkdir -p src/products/entities
mkdir -p src/products/dto
mkdir -p src/products/services
mkdir -p src/products/controllers

cd ..
```

### Paso 4: Crear Archivo de Entidad (Product)

**Archivo**: `product-service/src/products/entities/product.entity.ts`

```typescript
export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
}
```

### Paso 5: Crear Data Transfer Object (DTO)

**Archivo**: `product-service/src/products/dto/create-product.dto.ts`

```typescript
import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;
}
```

**Archivo**: `product-service/src/products/dto/update-product.dto.ts`

```typescript
import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;
}
```

### Paso 6: Crear Servicio de Productos

**Archivo**: `product-service/src/products/services/product.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Gaming',
      description: 'High performance gaming laptop',
      price: 1200.00,
      stock: 5,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      price: 35.99,
      stock: 50,
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Monitor 4K',
      description: '27 inch 4K monitor',
      price: 450.00,
      stock: 10,
      createdAt: new Date(),
    },
  ];

  private nextId = 4;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.nextId++,
      ...createProductDto,
      createdAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, updateProductDto);
    return product;
  }

  remove(id: number): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
  }

  decrementStock(id: number, quantity: number): Product {
    const product = this.findOne(id);
    if (product.stock < quantity) {
      throw new NotFoundException(
        `Insufficient stock for product ${id}. Available: ${product.stock}, Requested: ${quantity}`,
      );
    }
    product.stock -= quantity;
    return product;
  }
}
```

### Paso 7: Crear Controlador de Productos

**Archivo**: `product-service/src/products/controllers/product.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.productService.remove(id);
  }

  @Post(':id/decrement-stock')
  decrementStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() { quantity }: { quantity: number },
  ) {
    return this.productService.decrementStock(id, quantity);
  }
}
```

### Paso 8: Crear Módulo de Productos

**Archivo**: `product-service/src/products/products.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule {}
```

### Paso 9: Actualizar Module Principal

**Archivo**: `product-service/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Paso 10: Configurar Puerto

**Archivo**: `product-service/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Usar validación de DTOs
  app.useGlobalPipes(new ValidationPipe());
  
  // CORS habilitado (para comunicación entre servicios)
  app.enableCors();
  
  // Puerto: 3000
  await app.listen(3000);
  console.log(`Product Service is running on http://localhost:3000`);
}
bootstrap();
```

### Paso 11: Verificar Product Service

```bash
cd product-service
npm run build
npm start
```

**Output esperado**:
```
Product Service is running on http://localhost:3000
```

**Probar endpoint** (en otra terminal):
```bash
curl http://localhost:3000/products
```

**Expected response**:
```json
[
  {
    "id": 1,
    "name": "Laptop Gaming",
    "description": "High performance gaming laptop",
    "price": 1200,
    "stock": 5,
    "createdAt": "2025-11-16T03:25:00.000Z"
  },
  ...
]
```

---

## 🛒 Crear Cart Service

### Paso 1: Generar Proyecto NestJS

```bash
cd cart-service
nest new . --package-manager npm --skip-git
# Responder "npm" cuando pregunte por package manager
cd ..
```

### Paso 2: Instalar Dependencias Adicionales

```bash
cd cart-service

npm install class-validator class-transformer
npm install axios

cd ..
```

### Paso 3: Crear Estructura de Carpetas

```bash
cd cart-service

mkdir -p src/cart/entities
mkdir -p src/cart/dto
mkdir -p src/cart/services
mkdir -p src/cart/controllers
mkdir -p src/shared/clients

cd ..
```

### Paso 4: Crear Cliente HTTP para Product Service

**Archivo**: `cart-service/src/shared/clients/product.client.ts`

```typescript
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProductClient {
  private readonly productServiceUrl = 'http://product-service:3000';

  async getProduct(productId: number) {
    try {
      const response = await axios.get(
        `${this.productServiceUrl}/products/${productId}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch product ${productId}: ${error.message}`);
    }
  }

  async getAllProducts() {
    try {
      const response = await axios.get(
        `${this.productServiceUrl}/products`,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async decrementStock(productId: number, quantity: number) {
    try {
      const response = await axios.post(
        `${this.productServiceUrl}/products/${productId}/decrement-stock`,
        { quantity },
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to decrement stock for product ${productId}: ${error.message}`,
      );
    }
  }
}
```

### Paso 5: Crear Entidad CartItem

**Archivo**: `cart-service/src/cart/entities/cart-item.entity.ts`

```typescript
export class CartItem {
  id: number;
  userId: string;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  addedAt: Date;
}
```

### Paso 6: Crear DTOs para Cart

**Archivo**: `cart-service/src/cart/dto/add-to-cart.dto.ts`

```typescript
import { IsNumber, IsPositive, IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  userId: string;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
```

**Archivo**: `cart-service/src/cart/dto/cart-response.dto.ts`

```typescript
export class CartResponseDto {
  items: any[];
  totalItems: number;
  totalPrice: number;
}
```

### Paso 7: Crear Servicio de Carrito

**Archivo**: `cart-service/src/cart/services/cart.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItem } from '../entities/cart-item.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { ProductClient } from '../../shared/clients/product.client';

@Injectable()
export class CartService {
  private carts: Map<string, CartItem[]> = new Map();
  private nextItemId = 1;

  constructor(private productClient: ProductClient) {}

  async addToCart(addToCartDto: AddToCartDto): Promise<CartItem> {
    const { userId, productId, quantity } = addToCartDto;

    // Validar que el producto existe y tiene stock
    const product = await this.productClient.getProduct(productId);

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new Error(
        `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      );
    }

    // Obtener o crear carrito del usuario
    if (!this.carts.has(userId)) {
      this.carts.set(userId, []);
    }

    const userCart = this.carts.get(userId);

    // Verificar si el producto ya está en el carrito
    const existingItem = userCart.find((item) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.price;
      return existingItem;
    }

    // Crear nuevo item en carrito
    const cartItem: CartItem = {
      id: this.nextItemId++,
      userId,
      productId,
      productName: product.name,
      price: product.price,
      quantity,
      totalPrice: product.price * quantity,
      addedAt: new Date(),
    };

    userCart.push(cartItem);
    return cartItem;
  }

  getCart(userId: string): any {
    const userCart = this.carts.get(userId) || [];
    const totalPrice = userCart.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      userId,
      items: userCart,
      totalItems: userCart.length,
      totalPrice: Math.round(totalPrice * 100) / 100,
    };
  }

  removeFromCart(userId: string, cartItemId: number): void {
    const userCart = this.carts.get(userId);

    if (!userCart) {
      throw new NotFoundException(`Cart for user ${userId} not found`);
    }

    const index = userCart.findIndex((item) => item.id === cartItemId);

    if (index === -1) {
      throw new NotFoundException(
        `Cart item ${cartItemId} not found in user's cart`,
      );
    }

    userCart.splice(index, 1);
  }

  clearCart(userId: string): void {
    this.carts.delete(userId);
  }

  getAllCarts(): any {
    const result = [];
    this.carts.forEach((items, userId) => {
      result.push(this.getCart(userId));
    });
    return result;
  }
}
```

### Paso 8: Crear Controlador de Carrito

**Archivo**: `cart-service/src/cart/controllers/cart.controller.ts`

```typescript
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Delete(':userId/item/:cartItemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromCart(
    @Param('userId') userId: string,
    @Param('cartItemId') cartItemId: string,
  ) {
    this.cartService.removeFromCart(userId, parseInt(cartItemId, 10));
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  clearCart(@Param('userId') userId: string) {
    this.cartService.clearCart(userId);
  }

  @Get()
  getAllCarts() {
    return this.cartService.getAllCarts();
  }
}
```

### Paso 9: Crear Módulo de Carrito

**Archivo**: `cart-service/src/cart/cart.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { ProductClient } from '../shared/clients/product.client';

@Module({
  controllers: [CartController],
  providers: [CartService, ProductClient],
})
export class CartModule {}
```

### Paso 10: Actualizar Module Principal

**Archivo**: `cart-service/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### Paso 11: Configurar Puerto

**Archivo**: `cart-service/src/main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Usar validación de DTOs
  app.useGlobalPipes(new ValidationPipe());
  
  // CORS habilitado (para comunicación entre servicios)
  app.enableCors();
  
  // Puerto: 3001
  await app.listen(3001);
  console.log(`Cart Service is running on http://localhost:3001`);
}
bootstrap();
```

### Paso 12: Verificar Cart Service (CON Product Service corriendo)

```bash
cd cart-service
npm run build
npm start
```

**Output esperado**:
```
Cart Service is running on http://localhost:3001
```

---

## 🔗 Comunicación Entre Servicios

### Verificar Comunicación (Ambos servicios deben estar corriendo)

**Terminal 1 - Product Service**:
```bash
cd product-service
npm start
```

**Terminal 2 - Cart Service**:
```bash
cd cart-service
npm start
```

**Terminal 3 - Probar comunicación**:

```bash
# 1. Obtener productos disponibles
curl http://localhost:3000/products

# 2. Agregar producto al carrito
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "productId": 1,
    "quantity": 2
  }'

# 3. Obtener carrito del usuario
curl http://localhost:3001/cart/user123

# Expected response:
# {
#   "userId": "user123",
#   "items": [...],
#   "totalItems": 1,
#   "totalPrice": 2400
# }
```

---

## 🐳 Dockerización

### Paso 1: Crear Dockerfile para Product Service

**Archivo**: `product-service/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
```

### Paso 2: Crear Dockerfile para Cart Service

**Archivo**: `cart-service/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3001

CMD ["node", "dist/main"]
```

### Paso 3: Crear .dockerignore

**Archivo**: `product-service/.dockerignore`

```
node_modules
npm-debug.log
dist
.git
.gitignore
README.md
.env
```

**Archivo**: `cart-service/.dockerignore`

```
node_modules
npm-debug.log
dist
.git
.gitignore
README.md
.env
```

### Paso 4: Construir Imágenes Docker

```bash
# Build Product Service image
cd product-service
docker build -t product-service:1.0.0 .

# Build Cart Service image
cd ../cart-service
docker build -t cart-service:1.0.0 .

cd ..
```

**Verificar imágenes**:
```bash
docker images | grep -E "product-service|cart-service"
```

---

## 🚀 Orquestación con Docker Compose

### Paso 1: Crear docker-compose.yml

**Archivo**: `docker-compose.yml` (en la raíz, al mismo nivel que product-service y cart-service)

```yaml
version: '3.8'

services:
  product-service:
    build:
      context: ./product-service
      dockerfile: Dockerfile
    container_name: product-service
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    networks:
      - microservices-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/products"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  cart-service:
    build:
      context: ./cart-service
      dockerfile: Dockerfile
    container_name: cart-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    depends_on:
      product-service:
        condition: service_healthy
    networks:
      - microservices-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/cart"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

networks:
  microservices-network:
    driver: bridge
```

### Paso 2: Levantar Con Docker Compose

```bash
# Desde la raíz del proyecto (donde está docker-compose.yml)
docker-compose up -d
```

**Output esperado**:
```
Creating network "microservices-network" with driver "bridge"
Building product-service
Building cart-service
Creating product-service ... done
Creating cart-service ... done
```

### Paso 3: Verificar Servicios

```bash
# Ver servicios corriendo
docker-compose ps

# Ver logs en vivo
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs product-service
docker-compose logs cart-service
```

### Paso 4: Detener Servicios

```bash
# Detener servicios
docker-compose down

# Detener y remover volúmenes
docker-compose down -v

# Remover imágenes también
docker-compose down --rmi all
```

---

## ✅ Pruebas y Validación

### Colección de Endpoints para Probar

#### Product Service (Puerto 3000)

```bash
# 1. Listar todos los productos
curl -X GET http://localhost:3000/products

# 2. Obtener un producto específico
curl -X GET http://localhost:3000/products/1

# 3. Crear un nuevo producto
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SSD 1TB",
    "description": "Fast SSD storage",
    "price": 150.00,
    "stock": 20
  }'

# 4. Actualizar un producto
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming Pro",
    "price": 1500.00
  }'

# 5. Eliminar un producto
curl -X DELETE http://localhost:3000/products/4
```

#### Cart Service (Puerto 3001)

```bash
# 1. Agregar producto al carrito
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "productId": 1,
    "quantity": 2
  }'

# 2. Ver carrito del usuario
curl -X GET http://localhost:3001/cart/user123

# 3. Agregar otro producto
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "productId": 2,
    "quantity": 1
  }'

# 4. Ver carrito actualizado
curl -X GET http://localhost:3001/cart/user123

# 5. Remover item del carrito (usar el ID del item de la respuesta anterior)
curl -X DELETE http://localhost:3001/cart/user123/item/1

# 6. Ver todos los carritos
curl -X GET http://localhost:3001/cart

# 7. Limpiar carrito completo
curl -X DELETE http://localhost:3001/cart/user123
```

### Validación de Comunicación Entre Servicios

```bash
# Verificar que Cart Service puede hablar con Product Service
# 1. Asegurarse de que ambos servicios están corriendo
docker-compose ps

# 2. Agregar un producto con ID que existe
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser",
    "productId": 1,
    "quantity": 1
  }'

# Should return success with product name from Product Service
# Si trae el nombre del producto, la comunicación funciona

# 3. Agregar un producto que NO existe (debe fallar)
curl -X POST http://localhost:3001/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser",
    "productId": 999,
    "quantity": 1
  }'

# Should return error
```

### Usar Postman o Insomnia (Alternativa a curl)

1. **Importar colección de endpoints**:
   - Crear nueva Collection
   - Agregar los endpoints listados arriba
   - Organizar por carpeta (Products, Cart)

2. **Variables de entorno**:
   ```
   product_service_url: http://localhost:3000
   cart_service_url: http://localhost:3001
   user_id: user123
   ```

3. **Usar variables en requests**:
   ```
   {{product_service_url}}/products
   {{cart_service_url}}/cart/{{user_id}}
   ```

---

## 🔧 Troubleshooting

### Problema: "Port 3000 already in use"

**Solución**:
```bash
# Encontrar proceso usando el puerto (Linux/Mac)
lsof -i :3000

# Matar el proceso
kill -9 <PID>

# O cambiar puerto en main.ts:
# await app.listen(3002);  // Cambiar a 3002
```

### Problema: "Connection refused" entre servicios

**Solución**:
```bash
# Verificar que ambos servicios están corriendo
docker-compose ps

# Verificar logs para errores
docker-compose logs product-service
docker-compose logs cart-service

# Verificar conectividad entre contenedores
docker exec cart-service curl http://product-service:3000/products
```

### Problema: "Cannot find module" al iniciar servicio

**Solución**:
```bash
# Reinstalar dependencias
cd product-service
rm -rf node_modules package-lock.json
npm install

# O en el contenedor
docker-compose down
docker system prune
docker-compose up --build
```

### Problema: Build Docker falla

**Solución**:
```bash
# Ver logs de build
docker-compose build --no-cache

# O build individual
cd product-service
docker build --no-cache -t product-service:1.0.0 .
```

### Problema: "localhost" no funciona en Docker

**Solución**:
- En Docker, usar nombre del servicio en lugar de localhost
- En `docker-compose.yml`, Product Service es accesible en: `http://product-service:3000`
- No en: `http://localhost:3000` (desde dentro del contenedor)

### Problema: CORS error

**Solución**:
- Ya está habilitado en `main.ts` con `app.enableCors()`
- Si persiste, agregarsettings en main.ts:
```typescript
app.enableCors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
```

---

## 📚 Estructura Final del Proyecto

```
microservices-workshop/
├── product-service/
│   ├── src/
│   │   ├── products/
│   │   │   ├── controllers/
│   │   │   │   └── product.controller.ts
│   │   │   ├── services/
│   │   │   │   └── product.service.ts
│   │   │   ├── entities/
│   │   │   │   └── product.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-product.dto.ts
│   │   │   │   └── update-product.dto.ts
│   │   │   └── products.module.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── cart-service/
│   ├── src/
│   │   ├── cart/
│   │   │   ├── controllers/
│   │   │   │   └── cart.controller.ts
│   │   │   ├── services/
│   │   │   │   └── cart.service.ts
│   │   │   ├── entities/
│   │   │   │   └── cart-item.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── add-to-cart.dto.ts
│   │   │   │   └── cart-response.dto.ts
│   │   │   └── cart.module.ts
│   │   ├── shared/
│   │   │   └── clients/
│   │   │       └── product.client.ts
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ✨ Comandos Útiles Rápidos

```bash
# Desarrollo local (sin Docker)
cd product-service && npm start
# En otra terminal:
cd cart-service && npm start

# Con Docker Compose
docker-compose up
docker-compose down
docker-compose logs -f
docker-compose ps

# Build individual
docker build -t product-service:1.0.0 ./product-service
docker run -p 3000:3000 product-service:1.0.0

# Limpiar Docker
docker system prune
docker system prune -a
```

---

## 🎓 Siguientes Pasos (Extensiones del Workshop)

1. **Agregar API Gateway**: Kong o Spring Cloud Gateway
2. **Agregar Base de Datos Real**: PostgreSQL + TypeORM
3. **Service Discovery**: Eureka Server o Consul
4. **Logging Distribuido**: Winston Logger + ELK Stack
5. **Monitoreo**: Prometheus + Grafana
6. **Message Queue**: RabbitMQ o Kafka para comunicación asíncrona

---

**Versión**: 1.0  
**Última actualización**: Noviembre 2025  
**Tecnologías**: Node.js 18+, NestJS 10+, Docker, Docker Compose
