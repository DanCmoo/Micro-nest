import { Controller, Get, Post, Delete, Body, Param, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('api/cart')
export class CartProxyController {
  private readonly cartServiceUrl = 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  @Get()
  async getAllCarts(@Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.cartServiceUrl}/cart`)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching carts' });
    }
  }

  @Get(':userId')
  async getCart(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.cartServiceUrl}/cart/${userId}`)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching cart' });
    }
  }

  @Post('add')
  async addToCart(@Body() body: any, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.cartServiceUrl}/cart/add`, body)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Error adding to cart';
      return res.status(status).json({ 
        statusCode: status,
        message: message,
        error: error.response?.data?.error || 'Internal Server Error'
      });
    }
  }

  @Delete(':userId')
  async clearCart(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.cartServiceUrl}/cart/${userId}`)
      );
      return res.status(response.status).send();
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error clearing cart' });
    }
  }

  @Delete(':userId/item/:cartItemId')
  async removeFromCart(
    @Param('userId') userId: string,
    @Param('cartItemId') cartItemId: string,
    @Res() res: Response
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.cartServiceUrl}/cart/${userId}/item/${cartItemId}`)
      );
      return res.status(response.status).send();
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error removing item from cart' });
    }
  }
}
