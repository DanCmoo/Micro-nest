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
