import { Inject } from '@nestjs/common';
import { CartRepository } from '../../../domain/repositories/cart.repository';
import { CartDto } from '../dtos/cart.dto';
import { ProductDto } from '../dtos/product.dto';
import { CartService } from '../../../domain/services/cart.service';
import { CartModel } from '../../../domain/models/cart/cart.model';
import { ProductModel } from '../../../domain/models/product.model';

export class CartApplicationService {
  constructor(
    @Inject('CartRepository') private readonly cartRepository: CartRepository,
    private readonly cartService: CartService,
  ) {}

  async getCartById(id: string): Promise<CartDto> {
    const cart = await this.cartService.findCart(id);

    return this.mapCartToDto(cart);
  }

  async addProductToCart(cartId: string, dto: ProductDto) {
    const { productId, quantity } = dto;
    const cart = await this.cartService.addProductToCart(
      cartId,
      productId,
      quantity,
    );

    return this.mapCartToDto(cart);
  }

  async removeProductFromCart(cartId: string, dto: ProductDto) {
    const { productId, quantity } = dto;
    const cart = await this.cartService.removeProductFromCart(
      cartId,
      productId,
      quantity,
    );

    return this.mapCartToDto(cart);
  }

  async checkout(cartId: string, currency: string) {
    const cart = await this.cartService.checkout(cartId, currency);

    return {
      orderedProducts: this.mapProducts(cart.products),
      priceToPay: {
        currency: cart.price.currency,
        amount: cart.price.amount,
      },
    };
  }

  private mapCartToDto(cart: CartModel) {
    return {
      cartId: cart.id,
      products: this.mapProducts(cart.getProducts()),
    };
  }

  private mapProducts(products: ProductModel[]) {
    return products.map(product => ({
      quantity: product.quantity,
      name: product.name,
      productId: product.id,
      price: {
        currency: product.price.currency,
        amount: product.price.amount,
      },
    }));
  }
}
