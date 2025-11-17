import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductProxyController } from './controllers/product-proxy.controller';
import { CartProxyController } from './controllers/cart-proxy.controller';

@Module({
  imports: [HttpModule],
  controllers: [ProductProxyController, CartProxyController],
})
export class GatewayModule {}
