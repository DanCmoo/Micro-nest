import { Controller, Get, Post, Put, Delete, Body, Param, Req, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('api/products')
export class ProductProxyController {
  private readonly productServiceUrl = 'http://localhost:3000';

  constructor(private readonly httpService: HttpService) {}

  @Get()
  async getAllProducts(@Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products`)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching products' });
    }
  }

  @Get(':id')
  async getProduct(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.productServiceUrl}/products/${id}`)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error fetching product' });
    }
  }

  @Post()
  async createProduct(@Body() body: any, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.productServiceUrl}/products`, body)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error creating product' });
    }
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.productServiceUrl}/products/${id}`, body)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error updating product' });
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.productServiceUrl}/products/${id}`)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error deleting product' });
    }
  }

  @Post(':id/decrement-stock')
  async decrementStock(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.productServiceUrl}/products/${id}/decrement-stock`, body)
      );
      return res.status(response.status).json(response.data);
    } catch (error) {
      return res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error decrementing stock' });
    }
  }
}
