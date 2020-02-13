import { CartRepository } from '../repositories/cart.repository';
import { CartModel } from '../models/cart/cart.model';
import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { EntityNotFoundError } from '../errors/entity-not-found.error';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { NotEnoughProductsInStockError } from '../errors/not-enough-products-in-stock.error';
import { CurrencyRatesRepository } from '../repositories/currency-rates.repository';
import { makeCalculateProductsPrice } from '../currencies/calculate-products-price';
import { CheckedOutCartModel } from '../models/cart/checked-out-cart.model';
import { EmptyCartCheckoutError } from '../errors/empty-cart-checkout.error';

@Injectable()
export class CartService {
  constructor(
    @Inject('CartRepository') private readonly cartRepository: CartRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('CurrencyRatesRepository')
    private readonly currencyRatesRepository: CurrencyRatesRepository,
  ) {}

  async createNew() {
    const cart = new CartModel();
    cart.id = uuid();

    await this.cartRepository.saveCart(cart);

    return cart.id;
  }

  async findCart(cartId: string) {
    const cart = this.getCart(cartId);

    return cart;
  }

  async addProductToCart(cartId: string, productId: string, quantity: number) {
    const cart = await this.getCart(cartId);

    const product = await this.productRepository.findProduct(productId);

    if (!product) {
      throw new EntityNotFoundError(productId, 'product');
    }

    if (product.quantity < quantity) {
      throw new NotEnoughProductsInStockError(
        `Not enough products with id ${productId}. Got ${product.quantity}, requested ${quantity}.`,
      );
    }

    cart.addProduct({ ...product, quantity });
    await this.productRepository.removeProduct(productId, quantity);

    return cart;
  }

  async removeProductFromCart(
    cartId: string,
    productId: string,
    quantity: number,
  ) {
    const cart = await this.getCart(cartId);

    const actuallyRemovedCount = cart.removeProduct(productId, quantity);
    await this.productRepository.addProduct(productId, actuallyRemovedCount);

    return cart;
  }

  async checkout(
    cartId: string,
    currency: string,
  ): Promise<CheckedOutCartModel> {
    const cart = await this.getCart(cartId);

    const cartProducts = cart.getProducts();

    if (cartProducts.length === 0) {
      throw new EmptyCartCheckoutError();
    }

    const exchangeRates = await this.currencyRatesRepository.getLatestCurrencyRates();
    const calculateProductPrice = makeCalculateProductsPrice(exchangeRates);

    const checkedOutCart = {
      products: cartProducts,
      price: calculateProductPrice(cartProducts, currency),
    };

    await Promise.all([
      this.cartRepository.removeCart(cartId),
      this.cartRepository.saveCheckedOutCart(checkedOutCart),
    ]);

    return checkedOutCart;
  }

  private async getCart(cartId: string) {
    const cart = await this.cartRepository.findCart(cartId);

    if (!cart) {
      throw new EntityNotFoundError(cartId, 'cart');
    }

    const cartModel = new CartModel();

    cartModel.id = cart.id;
    cartModel.products = cart.products;

    return cartModel;
  }
}
