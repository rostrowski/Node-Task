import { PriceModel } from "./price.model";

export class ProductModel {
  id: string;
  name: string;
  price: PriceModel;
  quantity: number;
  description?: string;
}