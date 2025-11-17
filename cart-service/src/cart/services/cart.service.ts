import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    // Obtener o crear carrito del usuario
    if (!this.carts.has(userId)) {
      this.carts.set(userId, []);
    }

    const userCart = this.carts.get(userId)!;

    // Verificar si el producto ya está en el carrito
    const existingItem = userCart.find((item) => item.productId === productId);

    // Validar stock total (cantidad en carrito + nueva cantidad)
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentQuantityInCart + quantity;

    if (product.stock < totalQuantity) {
      throw new BadRequestException(
        `Insufficient stock for ${product.name}. Available: ${product.stock}, Already in cart: ${currentQuantityInCart}, Requested: ${quantity}`,
      );
    }

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
    const result: any[] = [];
    this.carts.forEach((items, userId) => {
      result.push(this.getCart(userId));
    });
    return result;
  }
}
