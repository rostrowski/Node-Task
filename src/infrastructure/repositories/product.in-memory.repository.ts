import { ProductRepository } from '../../domain/repositories/product.repository';
import { EntityNotFoundError } from '../../domain/errors/entity-not-found.error';
import { ProductModel } from '../../domain/models/product.model';

const products: ProductModel[] = [{
  id: '1',
  name: 'Dress',
  price: {
    amount: 100,
    currency: 'EUR'
  },
  quantity: 5,
  description: 'Fanciest existing dress',
}, {
  id: '2',
  name: 'Skateboard',
  price: {
    amount: 19,
    currency: 'USD'
  },
  quantity: 11,
  description: 'THPS',
}, {
  id: '3',
  name: 'C# in Depth',
  price: {
    amount: 77,
    currency: 'PLN'
  },
  quantity: 1,
  description: 'What is this book doing in this codebase?!',
}]

export class ProductInMemoryRepository implements ProductRepository {
  async findProduct(id: string) {
    return products.find(product => product.id === id);
  }

  async removeProduct(id: string, quantity: number) {
    const productToRemove = products.find(product => product.id === id);

    productToRemove.quantity -= quantity;
  }

  async addProduct(id: string, quantity: number) {
    const productToAdd = products.find(product => product.id === id);

    productToAdd.quantity += quantity;
  }
}