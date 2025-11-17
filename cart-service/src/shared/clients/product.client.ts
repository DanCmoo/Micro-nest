import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProductClient {
  private readonly productServiceUrl = 'http://localhost:3000';

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
