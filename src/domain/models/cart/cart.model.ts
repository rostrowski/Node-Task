import { ProductModel } from '../product.model';

interface ProductsById {
  [id: string]: ProductModel;
}

export class CartModel {
  id: string;
  products: ProductsById = {};

  addProduct(newProduct: ProductModel) {
    const existingProduct = this.products[newProduct.id];

    if (existingProduct) {
      existingProduct.quantity += newProduct.quantity;
      this.products[newProduct.id] = existingProduct;
    } else {
      this.products[newProduct.id] = Object.assign({}, newProduct);
    }
  }

  removeProduct(productId: string, quantity: number): number {
    if (!this.products[productId]) {
      return 0;
    }

    const productToRemove = Object.assign({}, this.products[productId]);

    productToRemove.quantity = Math.max(productToRemove.quantity - quantity, 0);

    if (productToRemove.quantity === 0) {
      const actuallyRemoved = this.products[productId].quantity;

      delete this.products[productId];

      return actuallyRemoved;
    } else {
      this.products[productId] = productToRemove;
      return quantity;
    }
  }

  getProducts(): ProductModel[] {
    return Object.values(this.products);
  }
}
