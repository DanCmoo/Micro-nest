import { IsNumber, IsPositive, IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  userId: string;

  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
