import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS habilitado para el frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });
  
  // Puerto: 4000
  await app.listen(4000);
  console.log(`API Gateway is running on http://localhost:4000`);
}
bootstrap();
