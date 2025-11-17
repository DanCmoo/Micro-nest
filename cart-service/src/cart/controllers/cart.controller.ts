import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Body() addToCartDto: AddToCartDto) {
    try {
      return await this.cartService.addToCart(addToCartDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error adding to cart',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
