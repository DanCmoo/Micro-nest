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
