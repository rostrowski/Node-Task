import { ProductModel } from '../models/product.model';

export interface ProductRepository {
  findProduct: (id: string) => Promise<ProductModel | undefined>;
  addProduct: (id: string, quantity: number) => Promise<void>;
  removeProduct: (id: string, quantity: number) => Promise<void>;
}