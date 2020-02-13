import { ProductInCartDto } from './product-in-cart.dto';

export class CartDto {
  cartId: string;
  products: ProductInCartDto[];
}
