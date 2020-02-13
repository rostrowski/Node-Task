import { CartRepository } from '../../domain/repositories/cart.repository';
import { CartModel } from '../../domain/models/cart/cart.model';
import { Injectable } from '@nestjs/common';
import { CheckedOutCartModel } from '../../domain/models/cart/checked-out-cart.model';

interface CartInMemoryStorage {
  [id: string]: CartModel;
}

@Injectable()
export class CartInMemoryRepository implements CartRepository {
  private readonly carts: CartInMemoryStorage = {};
  private readonly checkedOutCarts: CheckedOutCartModel[] = [];

  async saveCart(cart: CartModel) {
    this.carts[cart.id] = Object.assign({}, cart);
  }

  async saveCheckedOutCart(cart: CheckedOutCartModel) {
    this.checkedOutCarts.push(cart);
  }

  async findCart(cartId: string) {
    return this.carts[cartId];
  }

  async removeCart(id: string) {
    delete this.carts[id];
  }
}
