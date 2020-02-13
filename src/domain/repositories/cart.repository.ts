import { CartModel } from '../models/cart/cart.model';
import { CheckedOutCartModel } from '../models/cart/checked-out-cart.model';
type CartId = string;

export interface CartRepository {
  saveCart: (cart: CartModel) => Promise<void>;
  saveCheckedOutCart: (cart: CheckedOutCartModel) => Promise<void>;
  removeCart: (id: string) => Promise<void>;
  findCart: (id: string) => Promise<CartModel | undefined>;
}
