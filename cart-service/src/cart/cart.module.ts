import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { ProductClient } from '../shared/clients/product.client';

@Module({
  controllers: [CartController],
  providers: [CartService, ProductClient],
})
export class CartModule {}
