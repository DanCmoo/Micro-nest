import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Gaming',
      description: 'High performance gaming laptop',
      price: 1200.00,
      stock: 5,
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      price: 35.99,
      stock: 50,
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Monitor 4K',
      description: '27 inch 4K monitor',
      price: 450.00,
      stock: 10,
      createdAt: new Date(),
    },
  ];

  private nextId = 4;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.nextId++,
      ...createProductDto,
      createdAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, updateProductDto);
    return product;
  }

  remove(id: number): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    this.products.splice(index, 1);
  }

  decrementStock(id: number, quantity: number): Product {
    const product = this.findOne(id);
    if (product.stock < quantity) {
      throw new NotFoundException(
        `Insufficient stock for product ${id}. Available: ${product.stock}, Requested: ${quantity}`,
      );
    }
    product.stock -= quantity;
    return product;
  }
}
