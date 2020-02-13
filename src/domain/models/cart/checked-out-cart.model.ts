import { PriceModel } from '../price.model';
import { ProductModel } from '../product.model';

export class CheckedOutCartModel {
  products: ProductModel[];
  price: PriceModel;
}
